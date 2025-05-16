"use server";

import {nanoid} from "nanoid";
import {AddChapterInput, ChapterLanguage} from "@/app/__generated__/graphql";
import {getImageURLs} from "@/app/lib/utils/getImageURL";
import createApolloClient from "@/app/lib/utils/apollo-client";
import {CREATE_CHAPTER} from "@/app/lib/graphql/mutations";
import {isGraphQLErrors} from "@/app/lib/utils/errorsNarrowing";
import {getSignedURLs} from "@/app/lib/utils/awsUtils";
import {auth} from "@/auth";
import sharp from "sharp";
import dbConnect from "@/app/lib/utils/dbConnect";
import Manga from "@/app/lib/models/Manga";
import {ChapterImage, ChapterImages} from "@/app/lib/graphql/schema";
import {ChapterInput} from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/edit/_components/EditChapterForm";
import {EditChapterInputSchema} from "@/app/lib/utils/zodSchemas";
import {fetchInBatches} from "@/app/lib/utils/fetchInBatches";
import {cookies} from "next/headers";

export interface ChapterImageBuffer extends Omit<ChapterImage, "src"> {
  buffer: ArrayBuffer
}

export async function createChapter(data: ChapterInput, formData: FormData) {
  const session = await auth();

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
  const client = createApolloClient();
  const manga = await Manga.findOne({slug: mangaId}).lean();

  if (!manga) {
    return {success: false, message: "Manga not found"};
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
    const urls = await getSignedURLs(imagesURLs[language]);

    if ("failure" in urls) throw new Error("Unexpected error");

    signedURLs[language] = urls.success;
  }

  // Creating promises to create each image parallel
  const fetchImagesPromises: Promise<Response>[] = [];

  languages.forEach((language) => {
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

  // Fetching chapter to GraphQL resolver
  try {
    await client.mutate({
      mutation: CREATE_CHAPTER,
      variables: {chapter},
      context: {headers: {cookie: await cookies()}}
    });
  } catch (e: any) {
    console.error(e);

    if (isGraphQLErrors(e)) {
      return {success: false, message: e.graphQLErrors[0].message}
    }

    return {success: false, message: "Unexpected error"}
  }

  // Fetching images to the bucket
  await fetchInBatches(fetchImagesPromises, 30);

  return {success: true, message: "Chapter created"}
}