"use server";

import {nanoid} from "nanoid";
import {ChapterLanguage} from "@/app/__generated__/graphql";
import {getImageURLs} from "@/app/lib/utils/getImageURL";
import {deleteImage, getSignedURLs} from "@/app/lib/utils/awsUtils";
import {auth} from "@/auth";
import ChapterModel from "@/app/lib/models/Chapter";
import {HydratedDocument} from "mongoose";
import {Chapter, ChapterImages} from "@/app/lib/graphql/schema";
import sharp from "sharp";
import dbConnect from "@/app/lib/utils/dbConnect";
import {ChapterImageBuffer} from "@/app/(pages)/[locale]/manga/[id]/upload/actions";
import {
  ChapterInput
} from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/edit/_components/EditChapterForm";
import {EditChapterInputSchema} from "@/app/lib/utils/zodSchemas";
import {fetchInBatches} from "@/app/lib/utils/fetchInBatches";

export async function editChapter(data: ChapterInput, formData: FormData) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN" && session.user.role !== "MODERATOR") {
    throw new Error("Forbidden action!");
  }

  const validationResult = EditChapterInputSchema.safeParse(data);

  if (validationResult.error) {
    throw new Error("Validation error: " + validationResult.error.toString());
  }

  const {
    id,
    mangaId,
    titles,
    number,
  } = data
  const languages = data.languages.split(",") as ChapterLanguage[];

  await dbConnect();
  const chapter: HydratedDocument<Chapter> | null = await ChapterModel.findOne({id});

  if (!chapter) {
    throw new Error("No chapter found");
  }

  if (number !== chapter.number) {
    const chapterWithTheSameNumber = await ChapterModel.findOne({mangaId, number});

    if (chapterWithTheSameNumber) {
      throw new Error("Chapter with the same number already exists");
    }
  }

  const imagesMap: Record<ChapterLanguage, ChapterImageBuffer[]> = {} as Record<ChapterLanguage, ChapterImageBuffer[]>;

  await Promise.all(languages.map(async language => {
    const images = formData.getAll(`images-${language}`) as File[];

    if (images.length > 0) {
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
    }
  }))

  const languagesWithNewImages = Object.keys(imagesMap) as ChapterLanguage[];

  // Creating url for every image
  const imagesURLs: Record<ChapterLanguage, string[]> = {} as Record<ChapterLanguage, string[]>;

  languagesWithNewImages.forEach(language => {
      const imagesIds = Array.from({length: imagesMap[language].length}, () => nanoid());
      imagesURLs[language] = getImageURLs(mangaId, id, language, imagesIds);
  })

  // Generating signed urls for images
  const signedURLs: Record<ChapterLanguage, string[]> = {} as Record<ChapterLanguage, string[]>;

  for (const language of languagesWithNewImages) {
    const urls = await getSignedURLs(imagesURLs[language]);
    if ("failure" in urls) throw new Error("Unexpected error");
    signedURLs[language] = urls.success;
  }

  // Creating promises to create each image parallel
  const fetchImagesPromises: Promise<Response>[] = [];

  languagesWithNewImages.forEach((language) => {
    imagesMap[language].forEach((image, index) => {
      const imageFile = new File([image.buffer], 'combined-image.webp', { type: 'image/webp' });

      fetchImagesPromises.push(fetch(signedURLs[language][index], {
        method: "PUT",
        body: imageFile,
        headers: {
          "Content-type": imageFile.type
        }
      }))
    })
  })

  const processedImages: ChapterImages[] = [];

  languagesWithNewImages.forEach(language => {
    processedImages.push({
      language: language,
      images: imagesURLs[language]?.map((url, index) => ({
        src: url,
        width: imagesMap[language][index].width,
        height: imagesMap[language][index].height
      })) ?? []
    })
  })

  // Deleting the images that are getting replaced
  for (let language of languagesWithNewImages) {

    const images = chapter.images.find(e => e.language === language)?.images;
    if (!images) continue;
    for (let image of images) {
      await deleteImage(image.src);
    }
  }

  const imagesToDelete: string[] = [];

  // Assigning new values of versions to the chapter. If no image was provided, then keep the old ones.
  // It assigns versions based on array index
  processedImages.forEach((images) => {
    const noImageProvided = images.images.length === 0;

    // The index of the existing language, or -1 if it doesn't exist
    const index = chapter.images.findIndex(({language}) => images.language === language);

    // If added new language then push it to the end
    if (index === -1) {
      // If this is a new language and no image was provided
      if (noImageProvided) throw new Error(`No image provided for new ${images.language} language, on index ${index}.`)

      chapter.images.push(images);
    } else {
      imagesToDelete.push(...chapter.images[index].images.map(img => img.src));
      // If there are images for this language, then replace them
      chapter.images[index] = {
        ...images,
        images: noImageProvided
          ? chapter.images[index].images
          : images.images
      };
    }
  })

  const deletedLanguages = chapter.languages.filter(oldLang => !languages.includes(oldLang));
  const deletedImages = chapter.images
    .filter(({language}) => deletedLanguages.includes(language))
    .flatMap(img => img.images.flatMap(img => img.src));
  imagesToDelete.push(...deletedImages);

  // Deleting the images that are being replaced
  const deleteFetches = imagesToDelete
    .map(deleteImage)
    .filter(promise => !!promise)
  await fetchInBatches(deleteFetches, 25);

  // Deleting deleted versions
  chapter.images = chapter.images
    .filter(({language: oldLang}) => !deletedLanguages.includes(oldLang));

  chapter.number = number;
  chapter.languages = languages;
  chapter.titles = titles;

  // Saving the chapter
  await chapter.save();

  // Fetching images to the bucket
  await fetchInBatches(fetchImagesPromises, 30);

  return {success: true, message: "Chapter updated"}
}
