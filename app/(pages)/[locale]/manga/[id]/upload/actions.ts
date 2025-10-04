"use server";

import {nanoid} from "nanoid";
import {AddChapterInput, ChapterLanguage} from "@/app/__generated__/graphql";
import {getImageURLs} from "@/app/lib/utils/getImageURL";
import {deleteImage, getSignedURLs} from "@/app/lib/utils/awsUtils";
import {auth} from "@/auth";
import dbConnect from "@/app/lib/utils/dbConnect";
import Manga from "@/app/lib/models/Manga";
import {ChapterImage} from "@/app/lib/graphql/schema";
import {ChapterInput} from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/edit/_components/EditChapterForm";
import {EditChapterInputSchema} from "@/app/lib/utils/zodSchemas";
import {cookies} from "next/headers";
import Chapter from "@/app/lib/models/Chapter";
import {revalidateTag} from "next/cache";
import sharp from "sharp";

export interface ChapterImageBuffer extends Omit<ChapterImage, "src"> {
  buffer: ArrayBuffer
}

// export async function createChapter(data: ChapterInput, formData: FormData) {
//   try {
//     // Check if this is a service-to-service call
//     const cookieStore = await cookies();
//     const serviceToken = cookieStore.get('service-auth')?.value;
//     let isServiceCall = false;
//
//     let session = null;
//
//     if (serviceToken === process.env.SCRAP_API_SECRET_KEY) {
//       // Service-to-service call, create a mock admin session
//       isServiceCall = true;
//       session = {
//         user: {
//           role: "ADMIN",
//           id: "scraping-service"
//         }
//       };
//     } else {
//       // Regular user call
//       session = await auth();
//     }
//
//     if (!session || session.user.role !== "ADMIN" && session.user.role !== "MODERATOR") {
//       throw new Error("Forbidden action!");
//     }
//
//     const validationResult = EditChapterInputSchema.safeParse(data);
//
//     if (validationResult.error) {
//       throw new Error("Validation error: " + validationResult.error.toString());
//     }
//
//     const {
//       mangaId,
//       titles,
//       number,
//     } = data
//     const languages = data.languages.split(",") as ChapterLanguage[];
//
//     await dbConnect();
//     const manga = await Manga.findOne({slug: mangaId});
//
//     if (!manga) {
//       return {success: false, message: "Manga not found"};
//     }
//
//     const existingChapter = await Chapter.exists({number, mangaId});
//
//     if (existingChapter) {
//       return {success: false, message: "Chapter with this number already exists in this manga"};
//     }
//
//     const chapterId = nanoid();
//
//     const imagesMap: Record<ChapterLanguage, ChapterImageBuffer[]> = {} as Record<ChapterLanguage, ChapterImageBuffer[]>;
//
//     await Promise.all(languages.map(async language => {
//       const images = formData.getAll(`images-${language}`) as File[];
//
//       if (images.length === 0) throw new Error(`No image for ${language} language`);
//
//       imagesMap[language] = [];
//
//       for (const img of images) {
//         const width = await sharp(await img.arrayBuffer()).metadata().then(res => res.width);
//         const height = await sharp(await img.arrayBuffer()).metadata().then(res => res.height);
//
//         if (!width || !height) throw new Error(`Wasn't able to extract metadata for ${img.name}`);
//
//         imagesMap[language].push({
//           buffer: await img.arrayBuffer(),
//           width,
//           height
//         });
//       }
//     }))
//
//     // Creating url for every image
//     const imagesURLs: Record<ChapterLanguage, string[]> = {} as Record<ChapterLanguage, string[]>;
//
//     languages.forEach(language => {
//       const imagesIds = Array.from({length: imagesMap[language].length}, () => nanoid());
//
//       imagesURLs[language] = getImageURLs(manga.id, chapterId, language, imagesIds);
//     })
//
//     // Generating signed urls for images
//     const signedURLs: Record<ChapterLanguage, string[]> = {} as Record<ChapterLanguage, string[]>;
//
//     for (const language of languages) {
//       const urls = await getSignedURLs(imagesURLs[language], {bypassAuth: isServiceCall});
//
//       if ("failure" in urls) throw new Error("Unexpected error");
//
//       signedURLs[language] = urls.success;
//     }
//
//     // Creating promises to create each image parallel
//     const fetchImagesPromises: Promise<Response | null>[] = [];
//
//     languages.forEach((language) => {
//       imagesMap[language].forEach((image, index) => {
//         const imageFile = new File([image.buffer], 'combined-image.webp', { type: 'image/webp' });
//
//
//         fetchImagesPromises.push(
//           retryPromise(
//             () =>
//             fetch(signedURLs[language][index], {
//               method: "PUT",
//               body: imageFile,
//               headers: {
//                 "Content-type": imageFile.type
//               }
//             }
//             ),
//             3,
//             5000,
//             (response) => !response.ok
//           ).then(({data}) => {
//             if (!data) {
//               console.error("Image file upload failed.");
//               return null;
//             }
//
//             return data;
//           })
//         )
//       })
//     })
//
//     const processedImages: ChapterImages[] = [];
//
//     languages.forEach(language => {
//       processedImages.push({
//         language: language,
//         images: imagesURLs[language]?.map((url, index) => ({
//           src: url,
//           width: imagesMap[language][index].width,
//           height: imagesMap[language][index].height
//         })) ?? []
//       })
//     })
//
//     // Creating chapter
//     const chapter: AddChapterInput = {
//       id: chapterId,
//       number,
//       titles: titles.map(title => ({...title, language: title.language as ChapterLanguage})),
//       mangaId: manga.id,
//       images: processedImages,
//       languages
//     }
//
//     // Saving chapter to database and images to bucket
//     try {
//       // Fetching images to the bucket
//       await fetchInBatches(fetchImagesPromises, 30);
//
//       const newChapter = new Chapter(chapter);
//       await newChapter.save();
//
//       manga.chapters.push(newChapter.id);
//       await manga.save();
//
//       // Revalidate manga and chapter pages
//       revalidateTag(`chapter-${manga.slug}-${chapter.number}`);
//       revalidateTag(`chapter-${manga.slug}-${chapter.number - 1}`);
//       revalidateTag(`manga-${manga.slug}`);
//     } catch (e) {
//       console.error("Error while fetching images", e);
//
//       // Clean up fetched images on error
//       await fetchInBatches(
//         languages.flatMap(language => {
//           return imagesURLs[language].map(url => {
//             return deleteImage(url);
//           })
//         })
//           .filter(promise => promise !== undefined)
//       )
//
//       return {success: false, message: "Failed to fetch images"};
//     }
//
//     return {success: true, message: "Chapter created"}
//   } catch (e) {
//     return {
//       success: false,
//       message: e instanceof Error ? e.message : "Error at creating chapter"
//     }
//   }
// }

// Interface for image metadata sent from client to server for signed URL generation
export interface ClientChapterImageMetadata extends Omit<ChapterImage, "src"> {
}

// Return type for initiateChapterUpload
export interface InitiateChapterUploadResult {
  success: boolean;
  message?: string;
  chapterId?: string;
  mangaId?: string;
  imagesToUpload?: Record<ChapterLanguage, {
    signedUrl: string;
    s3Path: string; // The final S3 path (e.g., /manga/mangaId/chapterId/en/imageId.webp)
    width: number;
    height: number;
  }[]>;
}

/**
 * Initiates the chapter upload process by validating input, generating IDs,
 * and providing signed URLs for direct client-to-S3 image uploads.
 * This function does NOT handle image buffers or database writes.
 */
export async function initiateChapterUpload(
  data: ChapterInput,
  imagesMetadata: Record<ChapterLanguage, ClientChapterImageMetadata[]>
): Promise<InitiateChapterUploadResult> {
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

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
      throw new Error("Forbidden action!");
    }

    const validationResult = EditChapterInputSchema.safeParse(data);

    if (validationResult.error) {
      throw new Error("Validation error: " + validationResult.error.toString());
    }

    const {
      mangaId,
      number,
      titles
    } = data;
    const languages = data.languages.split(",") as ChapterLanguage[];

    await dbConnect();
    const manga = await Manga.findOne({ slug: mangaId });

    if (!manga) {
      return { success: false, message: "Manga not found" };
    }

    const existingChapter = await Chapter.exists({ number, mangaId: manga.id });

    if (existingChapter) {
      return { success: false, message: "Chapter with this number already exists in this manga" };
    }

    const chapterId = nanoid();

    const imagesToUpload: Record<ChapterLanguage, {
      signedUrl: string;
      s3Path: string;
      width: number;
      height: number;
    }[]> = {} as Record<ChapterLanguage, { signedUrl: string; s3Path: string; width: number; height: number }[]>;

    for (const language of languages) {
      const currentLangImagesMetadata = imagesMetadata[language];
      if (!currentLangImagesMetadata || currentLangImagesMetadata.length === 0) {
        throw new Error(`No image metadata provided for ${language} language`);
      }

      const s3Paths: string[] = [];
      const imageDetails: { s3Path: string; width: number; height: number }[] = [];

      for (const imgMeta of currentLangImagesMetadata) {
        const imageId = nanoid(); // Generate image ID for each image
        const s3Path = getImageURLs(manga.id, chapterId, language, [imageId])[0]; // Get the S3 path
        s3Paths.push(s3Path);
        imageDetails.push({ s3Path, width: imgMeta.width, height: imgMeta.height });
      }

      const urlsResult = await getSignedURLs(s3Paths, { bypassAuth: isServiceCall });
      if ("failure" in urlsResult) {
        throw new Error("Unexpected error getting signed URLs: " + urlsResult.failure);
      }

      imagesToUpload[language] = urlsResult.success.map((signedUrl, index) => ({
        signedUrl,
        s3Path: imageDetails[index].s3Path,
        width: imageDetails[index].width,
        height: imageDetails[index].height,
      }));
    }

    return {
      success: true,
      chapterId,
      mangaId: manga.id,
      imagesToUpload,
      message: "Chapter upload initiated successfully."
    };
  } catch (e) {
    console.error("Error initiating chapter upload:", e);
    return {
      success: false,
      message: e instanceof Error ? e.message : "Error initiating chapter upload"
    };
  }
}

/**
 * Finalizes the chapter creation by saving the chapter data (with S3 image paths) to the database.
 * This function assumes images have already been successfully uploaded to S3.
 */
export async function finalizeChapterCreation(chapter: AddChapterInput) {
  try {
    const cookieStore = await cookies();
    const serviceToken = cookieStore.get('service-auth')?.value;
    let isServiceCall = false;

    let session = null;

    if (serviceToken === process.env.SCRAP_API_SECRET_KEY) {
      isServiceCall = true;
      session = {
        user: {
          role: "ADMIN",
          id: "scraping-service"
        }
      };
    } else {
      session = await auth();
    }

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
      throw new Error("Forbidden action!");
    }

    await dbConnect();

    const newChapter = new Chapter(chapter);
    await newChapter.save();

    const manga = await Manga.findOne({id: chapter.mangaId});
    if (!manga) {
      // This scenario should ideally be prevented by initiateChapterUpload
      throw new Error("Manga not found during chapter finalization.");
    }
    manga.chapters.push(newChapter.id);
    await manga.save();

    // Revalidate manga and chapter pages
    revalidateTag(`chapter-${manga.slug}-${chapter.number}`);
    revalidateTag(`chapter-${manga.slug}-${chapter.number - 1}`); // For previous chapter's next button
    revalidateTag(`manga-${manga.slug}`);

    return { success: true, message: "Chapter created successfully." };
  } catch (e) {
    console.error("Error finalizing chapter creation:", e);
    // If this fails, images are orphaned in S3. A more robust solution would involve a queue for cleanup.
    return {
      success: false,
      message: e instanceof Error ? e.message : "Error finalizing chapter creation"
    };
  }
}

/**
 * Server action to delete images from S3.
 * Used for cleanup in case of partial failures.
 */
export async function deleteChapterImagesServerAction(imagePaths: string[]) {
  const session = await auth();
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
    throw new Error("Forbidden action!");
  }

  const deletePromises = imagePaths.map(path => deleteImage(path));
  const results = await Promise.allSettled(deletePromises);

  const failures = results.filter(r => r.status === 'rejected');
  if (failures.length > 0) {
    console.error("Failed to delete some images:", failures);
    return { success: false, message: `Failed to delete ${failures.length} images.` };
  }
  return { success: true, message: "Images deleted successfully." };
}

/**
 * Gets the dimensions (width and height) of an image File object server-side.
 * @param file The image File object.
 * @returns A promise that resolves with the image dimensions.
 */
export async function getServerImageDimensions(file: File): Promise<{ width: number; height: number }> {
  const metadata = await sharp(await file.arrayBuffer()).metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error(`Unable to extract metadata for ${file.name}`);
  }

  return {
    width: metadata.width,
    height: metadata.height
  };
}