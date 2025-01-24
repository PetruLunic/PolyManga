"use server";

import {combineAndCropImagesVertically} from "@/app/lib/utils/compositeImages";
import {nanoid} from "nanoid";
import {AddChapterInput, ChapterLanguage} from "@/app/__generated__/graphql";
import {ChapterLanguage as ChapterLanguageEnum} from"@/app/types";
import {getImageURLs} from "@/app/lib/utils/getImageURL";
import {AWS_BUCKET_URL, deleteImage, getSignedURLs} from "@/app/lib/utils/awsUtils";
import {CHAPTER_IMAGE_WIDTH, MAX_CHAPTER_IMAGE_HEIGHT} from "@/app/lib/utils/constants";
import {auth} from "@/auth";
import ChapterModel from "@/app/lib/models/Chapter";
import {HydratedDocument} from "mongoose";
import {Chapter, ChapterVersion} from "@/app/lib/graphql/schema";
import sharp from "sharp";

export async function editChapter(formData: FormData, languages: ChapterLanguage[]) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN" && session.user.role !== "MODERATOR") {
    throw new Error("Forbidden action!");
  }

  const mangaId = formData.get("mangaId") as string;
  const number = Number(formData.get("number") as string);
  const title = formData.get("title") as string;
  const id = formData.get("id") as string;

  if (!mangaId || !title || !Number.isInteger(number) || number < 0 || !id) {
    return {success: false, message: "Wrong entry data"};
  }

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

  // Cropping images into slices of MAX_HEIGHT and WIDTH
  const croppedImages: Record<ChapterLanguage, {images: Buffer[], width: number}> = {} as Record<ChapterLanguage, {images: Buffer[], width: number}>;

  await Promise.all(languages.map(async language => {
    const images = formData.getAll(`images-${language}`) as File[];

    if (images.length === 0) throw new Error(`No image for ${language} language`);

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

    imagesURLs[language] = getImageURLs(mangaId, id, language, imagesIds);
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
      const imageFile = new File([image], 'combined-image.jpeg', { type: 'image/jpeg' });


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
      language: language.toLowerCase() as ChapterLanguage,
      images: imagesURLs[language].map(url => ({
        src: AWS_BUCKET_URL + url,
        width: croppedImages[language].width,
        height: MAX_CHAPTER_IMAGE_HEIGHT
      }))
    })
  })

  // Deleting the images that are getting replaced
  for (let language of languages) {
    const images = chapter.versions.find(e => e.language === language.toLowerCase())?.images;

    console.log(images);
    if (!images) continue;

    for (let image of images) {
      await deleteImage(image.src);
    }
  }

  // Editing the chapter
  chapter.title = title;
  chapter.number = number;

  versions.forEach(version => {
    const index = chapter.versions.findIndex(e => e.language === version.language as unknown as ChapterLanguageEnum);

    // If there are images for this language, then replace them, otherwise push them
    if (index === -1) {
      chapter.versions.push(version as unknown as ChapterVersion);
    } else {
      chapter.versions[index] = version as unknown as ChapterVersion;
    }
  })

  // Saving the chapter
  await chapter.save();

  // Fetching images to aws cloud
  await Promise.all(fetchImagesPromises);

  return {success: true, message: "Chapter created"}
}