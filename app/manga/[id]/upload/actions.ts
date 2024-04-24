"use server";

import {getSignedURLs} from "@/app/lib/utils/getSignedURLs";
import {combineAndCropImagesVertically} from "@/app/lib/utils/compositeImages";
import {nanoid} from "nanoid";
import {ChapterLanguage} from "@/app/types";
import fs from "fs";

export async function createChapter(formData: FormData, languages: ChapterLanguage[]) {
  const mangaId = formData.get("mangaId") as string;
  const chapterNr = formData.getAll("chapterNumber") as string[];
  const chapterName = formData.get("chapterName") as string;

  if (!mangaId && !chapterName && !chapterNr) return;

  // const combinedImagesBuffers = await combineAndCropImagesVertically(images, 700, 3000);
  //
  // if (!combinedImagesBuffers) return;

  // Generating id for every image
  // const ids = Array.from({length: combinedImagesBuffers.length}, () => nanoid());

  // // Generating chapter id here to save images on cloud on dependence of id
  // const chapterId = nanoid();
  //
  // // Generating image urls
  // const signedUrls = await getSignedURLs(mangaId, chapterId, chapterLanguage, ids)
  //
  // if ("failure" in signedUrls) return;

  // for (let i = 0; i < combinedImagesBuffers.length; i++) {
  //   fs.writeFile(`public/manga/${mangaId}/fr/image-${i}-${nanoid()}.jpg`, combinedImagesBuffers[i], (err) => {
  //     if (err) {
  //       console.error('Error writing file:', err);
  //       return;
  //     }
  //     console.log('File saved successfully');
  //   });
  // }

  // const fetchPromises = combinedImagesBuffers.map((image, index) => {
  //   const imageFile = new File([image], 'combined-image.jpeg', { type: 'image/jpeg' });
  //
  //   return fetch(signedUrls.success[index], {
  //     method: "PUT",
  //     body: imageFile,
  //     headers: {
  //       "Content-type": imageFile.type
  //     }
  //   })
  // })

  // await Promise.all([
  //     ...fetchPromises
  // ])

}