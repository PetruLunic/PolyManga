"use server";

import {combineAndCropImagesVertically} from "@/app/lib/utils/compositeImages";
import {nanoid} from "nanoid";
import {AddChapterInput, ChapterLanguage} from "@/app/__generated__/graphql";
import {ChapterLanguage as ChapterLanguageEnum} from "@/app/types";
import {getImageURLs} from "@/app/lib/utils/getImageURL";
import {AWS_BUCKET_URL, deleteImage, getSignedURLs} from "@/app/lib/utils/awsUtils";
import {CHAPTER_IMAGE_WIDTH, MAX_CHAPTER_IMAGE_HEIGHT} from "@/app/lib/utils/constants";
import {auth} from "@/auth";
import ChapterModel from "@/app/lib/models/Chapter";
import {HydratedDocument} from "mongoose";
import {Chapter, ChapterVersion} from "@/app/lib/graphql/schema";
import sharp from "sharp";
import dbConnect from "@/app/lib/utils/dbConnect";
import {ChapterImageBuffer} from "@/app/(pages)/[locale]/manga/[id]/upload/actions";

export async function editChapter(formData: FormData, languages: ChapterLanguage[]) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN" && session.user.role !== "MODERATOR") {
    throw new Error("Forbidden action!");
  }

  const mangaId = formData.get("mangaId") as string;
  const number = Number(formData.get("number") as string);
  const id = formData.get("id") as string;

  // Extracting titles
  const titles: Record<ChapterLanguage, string> = languages.reduce((acc, lang) => {
    const title = formData.get(`title-${lang}`) as string;
    if (!title) throw new Error(`No title for ${lang} language provided`);
    return {...acc, [lang]: title};
  }, {} as Record<ChapterLanguage, string>);

  if (!mangaId || !Number.isInteger(number) || number < 0 || !id) {
    return {success: false, message: "Wrong entry data"};
  }

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

  // Cropping images into slices of MAX_HEIGHT and WIDTH
  // const croppedImages: Record<ChapterLanguage, {images: Buffer[], width: number}> = {} as Record<ChapterLanguage, {images: Buffer[], width: number}>;
  //
  // await Promise.all(languages.map(async language => {
  //   const images = formData.getAll(`images-${language}`) as File[];
  //
  //   if (images.length > 0) {
  //     croppedImages[language] = {
  //       width: CHAPTER_IMAGE_WIDTH,
  //       images: []
  //     }
  //
  //     // Extracting first image width
  //     const firstImageWidth = await sharp(await images[0].arrayBuffer()).metadata().then(res => res.width);
  //     croppedImages[language].width = firstImageWidth ?? CHAPTER_IMAGE_WIDTH;
  //     croppedImages[language].images = await combineAndCropImagesVertically(images, firstImageWidth ?? CHAPTER_IMAGE_WIDTH, MAX_CHAPTER_IMAGE_HEIGHT) || [];
  //   }
  //  }));
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

  const languagesWithNewImages = Object.keys(imagesMap);

  // Creating url for every image
  const imagesURLs: Record<ChapterLanguage, string[]> = {} as Record<ChapterLanguage, string[]>;

  languages.forEach(language => {
    if (languagesWithNewImages.includes(language)) {
      const imagesIds = Array.from({length: imagesMap[language].length}, () => nanoid());

      imagesURLs[language] = getImageURLs(mangaId, id, language, imagesIds);
    }
  })

  // Generating signed urls for images
  const signedURLs: Record<ChapterLanguage, string[]> = {} as Record<ChapterLanguage, string[]>;

  for (const language of languages) {
    if (languagesWithNewImages.includes(language)) {
      const urls = await getSignedURLs(imagesURLs[language]);

      if ("failure" in urls) throw new Error("Unexpected error");

      signedURLs[language] = urls.success;
    }
  }

  // Creating promises to create each image parallel
  const fetchImagesPromises: Promise<Response>[] = [];

  languages.forEach((language) => {
    if (languagesWithNewImages.includes(language)) {
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
    }
  })

  // Creating versions for chapter that are stored in DB
  const versions: AddChapterInput["versions"] = [];

  languages.forEach(language => {
    versions.push({
      language: language,
      title: titles[language],
      images: imagesURLs[language]?.map((url, index) => ({
        src: url,
        width: imagesMap[language][index].width,
        height: imagesMap[language][index].height
      })) ?? []
    })
  })

  // Deleting the images that are getting replaced
  for (let language of languagesWithNewImages) {

    const images = chapter.versions.find(e => e.language === language)?.images;
    if (!images) continue;
    for (let image of images) {
      await deleteImage(image.src);
    }
  }

  // Editing the number
  chapter.number = number;

  // Assigning new values of versions to the chapter. If no image was provided, then keep the old ones.
  // It assigns versions based on array index
  versions.forEach((version) => {
    const noImageProvided = version.images.length === 0;

    // The index of the existing language, or -1 if it doesn't exist
    const index = chapter.versions.findIndex(({language}) => version.language === language);

    // If added new language then push it to the end
    if (index === -1) {
      // If this is a new language and no image was provided
      if (noImageProvided) throw new Error(`No image provided for new ${version.language} language, on index ${index}.`)

      chapter.versions.push(version as unknown as ChapterVersion);
    } else {
      // If there are images for this language, then replace them
      chapter.versions[index] = {
        ...version,
        images: noImageProvided
          ? chapter.versions[index].images
          : version.images
      } as unknown as ChapterVersion;
    }
  })

  const deletedVersions = chapter.versions
    .filter(({language: lang1}) =>
      !versions.find(({language: lang2}) => lang1 === lang2))

  // Deleting the images of deleted versions
  for (let {images} of deletedVersions) {
    for (let image of images) {
      await deleteImage(image.src);
    }
  }

  // Deleting deleted versions
  chapter.versions = chapter.versions
    .filter(({language: lang1}) =>
      !deletedVersions.find(({language: lang2}) => lang1 === lang2))

  // Saving the chapter
  await chapter.save();

  // Fetching images to aws cloud
  await Promise.all(fetchImagesPromises);

  return {success: true, message: "Chapter updated"}
}