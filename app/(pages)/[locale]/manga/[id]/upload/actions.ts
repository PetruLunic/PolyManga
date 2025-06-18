"use server";

import {nanoid} from "nanoid";
import {AddChapterInput, ChapterLanguage} from "@/app/__generated__/graphql";
import {getImageURLs} from "@/app/lib/utils/getImageURL";
import {deleteImage, getSignedURLs} from "@/app/lib/utils/awsUtils";
import {auth} from "@/auth";
import sharp from "sharp";
import dbConnect from "@/app/lib/utils/dbConnect";
import Manga from "@/app/lib/models/Manga";
import {ChapterImage, ChapterImages} from "@/app/lib/graphql/schema";
import {ChapterInput} from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/edit/_components/EditChapterForm";
import {EditChapterInputSchema} from "@/app/lib/utils/zodSchemas";
import {fetchInBatches} from "@/app/lib/utils/fetchInBatches";
import {cookies} from "next/headers";
import Chapter from "@/app/lib/models/Chapter";
import retryPromise from "@/app/lib/utils/retryPromise";

export interface ChapterImageBuffer extends Omit<ChapterImage, "src"> {
  buffer: ArrayBuffer
}

export async function createChapter(data: ChapterInput, formData: FormData) {
  try {
    // Check if this is a service-to-service call
    const cookieStore = await cookies();
    const serviceToken = cookieStore.get('service-auth')?.value;
    let isServiceCall = false;

    let session = null;

    if (serviceToken === process.env.SCRAP_API_SECRET_KEY) {
      // Service-to-service call, create a mock admin session
      isServiceCall = true;
      session = {
        user: {
          role: "ADMIN",
          id: "scraping-service"
        }
      };
    } else {
      // Regular user call
      session = await auth();
    }

    if (!session || session.user.role !== "ADMIN" && session.user.role !== "MODERATOR") {
      throw new Error("Forbidden action!");
    }

    const validationResult = EditChapterInputSchema.safeParse(data);

    if (validationResult.error) {
      throw new Error("Validation error: " + validationResult.error.toString());
    }

    const {
      mangaId,
      titles,
      number,
    } = data
    const languages = data.languages.split(",") as ChapterLanguage[];

    await dbConnect();
    const manga = await Manga.findOne({slug: mangaId});

    if (!manga) {
      return {success: false, message: "Manga not found"};
    }

    const existingChapter = await Chapter.exists({number, mangaId});

    if (!existingChapter) {
      return {success: false, message: "Chapter with this number already exists in this manga"};
    }

    const chapterId = nanoid();

    const imagesMap: Record<ChapterLanguage, ChapterImageBuffer[]> = {} as Record<ChapterLanguage, ChapterImageBuffer[]>;

    await Promise.all(languages.map(async language => {
      const images = formData.getAll(`images-${language}`) as File[];

      if (images.length === 0) throw new Error(`No image for ${language} language`);

      imagesMap[language] = [];

      for (const img of images) {
        const width = await sharp(await img.arrayBuffer()).metadata().then(res => res.width);
        const height = await sharp(await img.arrayBuffer()).metadata().then(res => res.height);

        if (!width || !height) throw new Error(`Wasn't able to extract metadata for ${img.name}`);

        imagesMap[language].push({
          buffer: await img.arrayBuffer(),
          width,
          height
        });
      }
    }))

    // Creating url for every image
    const imagesURLs: Record<ChapterLanguage, string[]> = {} as Record<ChapterLanguage, string[]>;

    languages.forEach(language => {
      const imagesIds = Array.from({length: imagesMap[language].length}, () => nanoid());

      imagesURLs[language] = getImageURLs(manga.id, chapterId, language, imagesIds);
    })

    // Generating signed urls for images
    const signedURLs: Record<ChapterLanguage, string[]> = {} as Record<ChapterLanguage, string[]>;

    for (const language of languages) {
      const urls = await getSignedURLs(imagesURLs[language], {bypassAuth: isServiceCall});

      if ("failure" in urls) throw new Error("Unexpected error");

      signedURLs[language] = urls.success;
    }

    // Creating promises to create each image parallel
    const fetchImagesPromises: Promise<Response | null>[] = [];

    languages.forEach((language) => {
      imagesMap[language].forEach((image, index) => {
        const imageFile = new File([image.buffer], 'combined-image.webp', { type: 'image/webp' });


        fetchImagesPromises.push(
          retryPromise(
            () =>
            fetch(signedURLs[language][index], {
              method: "PUT",
              body: imageFile,
              headers: {
                "Content-type": imageFile.type
              }
            }
            ),
            3,
            5000,
            (response) => !response.ok
          ).then(({data}) => {
            if (!data) {
              console.error("Image file upload failed.");
              return null;
            }

            return data;
          })
        )
      })
    })

    const processedImages: ChapterImages[] = [];

    languages.forEach(language => {
      processedImages.push({
        language: language,
        images: imagesURLs[language]?.map((url, index) => ({
          src: url,
          width: imagesMap[language][index].width,
          height: imagesMap[language][index].height
        })) ?? []
      })
    })

    // Creating chapter
    const chapter: AddChapterInput = {
      id: chapterId,
      number,
      titles: titles.map(title => ({...title, language: title.language as ChapterLanguage})),
      mangaId: manga.id,
      images: processedImages,
      languages
    }

    // Saving chapter to database and images to bucket
    try {
      // Fetching images to the bucket
      await fetchInBatches(fetchImagesPromises, 30);

      const newChapter = new Chapter(chapter);
      await newChapter.save();

      manga.chapters.push(newChapter.id);
      await manga.save();
    } catch (e) {
      console.error("Error while fetching images", e);

      // Clean up fetched images on error
      await fetchInBatches(
        languages.flatMap(language => {
          return imagesURLs[language].map(url => {
            return deleteImage(url);
          })
        })
          .filter(promise => promise !== undefined)
      )

      return {success: false, message: "Failed to fetch images"};
    }

    return {success: true, message: "Chapter created"}
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : "Error at creating chapter"
    }
  }
}