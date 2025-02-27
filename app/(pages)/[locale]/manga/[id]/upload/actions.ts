"use server";

import {combineAndCropImagesVertically} from "@/app/lib/utils/compositeImages";
import {nanoid} from "nanoid";
import {AddChapterInput, ChapterLanguage} from "@/app/__generated__/graphql";
import {getImageURLs} from "@/app/lib/utils/getImageURL";
import createApolloClient from "@/app/lib/utils/apollo-client";
import {CREATE_CHAPTER} from "@/app/lib/graphql/mutations";
import {isGraphQLErrors} from "@/app/lib/utils/errorsNarrowing";
import {AWS_BUCKET_URL, getSignedURLs} from "@/app/lib/utils/awsUtils";
import {CHAPTER_IMAGE_WIDTH, MAX_CHAPTER_IMAGE_HEIGHT} from "@/app/lib/utils/constants";
import {auth} from "@/auth";
import sharp from "sharp";
import dbConnect from "@/app/lib/utils/dbConnect";
import Manga from "@/app/lib/models/Manga";

export async function createChapter(formData: FormData, languages: ChapterLanguage[]) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN" && session.user.role !== "MODERATOR") {
    throw new Error("Forbidden action!");
  }

  const client = createApolloClient();

  const slug = formData.get("slug") as string;
  const number = Number(formData.get("number") as string);

  // Extracting titles
  const titles: Record<ChapterLanguage, string> = languages.reduce((acc, lang) => {
    const title = formData.get(`title-${lang}`) as string;
    if (!title) throw new Error(`No title for ${lang} language provided`);
    return {...acc, [lang]: title};
  }, {} as Record<ChapterLanguage, string>)

  if (!slug || number < 0) {
    return {success: false, message: "Wrong entry data"};
  }

  await dbConnect();
  const manga = await Manga.findOne({slug}).lean();

  if (!manga) {
    return {success: false, message: "Manga not found"};
  }

  const chapterId = nanoid();

  // Cropping images into slices of MAX_HEIGHT and WIDTH
  const croppedImages: Record<ChapterLanguage, {images: Buffer[], width: number}> = {} as Record<ChapterLanguage, {images: Buffer[], width: number}>;

  await Promise.all(languages.map(async language => {
    const images = formData.getAll(`images-${language}`) as File[];

    if (images.length === 0) throw new Error(`No image for ${language} language`)

    croppedImages[language] = {
      width: CHAPTER_IMAGE_WIDTH,
      images: []
    }

    // Extracting first image width
    const firstImageWidth = await sharp(await images[0].arrayBuffer()).metadata().then(res => res.width);
    croppedImages[language].width = firstImageWidth ?? CHAPTER_IMAGE_WIDTH;
    croppedImages[language].images = await combineAndCropImagesVertically(images, firstImageWidth ?? CHAPTER_IMAGE_WIDTH, MAX_CHAPTER_IMAGE_HEIGHT) || [];
  }))

  // Creating url for every image
  const imagesURLs: Record<ChapterLanguage, string[]> = {} as Record<ChapterLanguage, string[]>;

  languages.forEach(language => {
    const imagesIds = Array.from({length: croppedImages[language].images.length}, () => nanoid());

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
    croppedImages[language].images.forEach((image, index) => {
      const imageFile = new File([image], 'combined-image.webp', { type: 'image/webp' });


      fetchImagesPromises.push(fetch(signedURLs[language][index], {
        method: "PUT",
        body: imageFile,
        headers: {
          "Content-type": imageFile.type
        }
      }))
    })
  })

  // Creating versions for chapter that are stored in DB
  const versions: AddChapterInput["versions"] = [];

  languages.forEach(language => {
    versions.push({
      language,
      title: titles[language],
      images: imagesURLs[language].map(url => ({
        src: AWS_BUCKET_URL + url,
        width: croppedImages[language].width,
        height: MAX_CHAPTER_IMAGE_HEIGHT
      }))
    })
  })

  // Creating chapter
  const chapter: AddChapterInput = {
    id: chapterId,
    number,
    mangaId: manga.id,
    versions
  }

  // Fetching chapter to GraphQL resolver
  try {
    await client.mutate({mutation: CREATE_CHAPTER, variables: {chapter}});
  } catch (e: any) {
    console.error(e);

    if (isGraphQLErrors(e)) {
      return {success: false, message: e.graphQLErrors[0].message}
    }

    return {success: false, message: "Unexpected error"}
  }

  // Fetching images to aws cloud
  await Promise.all(fetchImagesPromises);

  return {success: true, message: "Chapter created"}
}