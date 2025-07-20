import { ChapterInput } from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/edit/_components/EditChapterForm";
import { ChapterLanguage } from "@/app/__generated__/graphql";
import {
  ClientChapterImageMetadata,
  deleteChapterImagesServerAction,
  finalizeChapterCreation, getServerImageDimensions,
  initiateChapterUpload
} from "./actions";
import {getClientImageDimensions} from "@/app/lib/utils/clientImageUtils";
import retryPromise from "@/app/lib/utils/retryPromise";

export interface CreateChapterResult {
  success: boolean;
  message: string;
  chapterId?: string;
  imagesProcessed?: number;
  totalImages?: number;
}

export interface CreateChapterOptions {
  progressCallback?: (progress: {
    stage: 'initiating' | 'processing' | 'uploading' | 'finalizing';
    completed: number;
    total: number;
    message: string;
  }) => void;
}

export async function createChapter(
  data: ChapterInput,
  imageFiles: Record<ChapterLanguage, File[]>,
  options: CreateChapterOptions = {}
): Promise<CreateChapterResult> {
  const { progressCallback } = options;
  const isServer = typeof window === 'undefined';

  try {
    const languages = data.languages.split(",") as ChapterLanguage[];
    let totalImages = 0;

    // Count total images
    languages.forEach(language => {
      totalImages += imageFiles[language]?.length || 0;
    });

    // Step 1: Process images and extract metadata
    progressCallback?.({
      stage: 'processing',
      completed: 0,
      total: totalImages + 2, // +2 for initiate and finalize
      message: 'Processing images...'
    });

    const imagesData: Record<ChapterLanguage, Array<{
      buffer: ArrayBuffer;
      width: number;
      height: number;
    }>> = {} as Record<ChapterLanguage, Array<{
      buffer: ArrayBuffer;
      width: number;
      height: number;
    }>>;

    const imagesMetadata: Record<ChapterLanguage, ClientChapterImageMetadata[]> = {} as Record<ChapterLanguage, ClientChapterImageMetadata[]>;

    let processedCount = 0;

    // Process images based on environment
    for (const language of languages) {
      const images = imageFiles[language];
      if (!images || images.length === 0) {
        throw new Error(`No images found for ${language} language`);
      }

      imagesData[language] = [];
      imagesMetadata[language] = [];

      for (const file of images) {
        const buffer = await file.arrayBuffer();
        let dimensions: { width: number; height: number };

        if (isServer) {
          dimensions = await getServerImageDimensions(file);
        } else {
          dimensions = await getClientImageDimensions(file);
        }

        imagesData[language].push({
          buffer,
          width: dimensions.width,
          height: dimensions.height
        });

        imagesMetadata[language].push({
          width: dimensions.width,
          height: dimensions.height
        });

        processedCount++;
        progressCallback?.({
          stage: 'processing',
          completed: processedCount,
          total: totalImages + 2,
          message: `Processed ${processedCount}/${totalImages} images`
        });
      }
    }

    // Step 2: Initiate chapter upload
    progressCallback?.({
      stage: 'initiating',
      completed: totalImages,
      total: totalImages + 2,
      message: 'Getting signed URLs...'
    });

    const initiateResult = await initiateChapterUpload(data, imagesMetadata);

    if (!initiateResult.success || !initiateResult.chapterId || !initiateResult.imagesToUpload) {
      return {
        success: false,
        message: initiateResult.message || 'Failed to initiate chapter upload'
      };
    }

    // Step 3: Upload images to S3 using ArrayBuffer
    progressCallback?.({
      stage: 'uploading',
      completed: 0,
      total: totalImages,
      message: 'Uploading images...'
    });

    const uploadPromises: Promise<void>[] = [];
    let uploadedCount = 0;

    for (const language of languages) {
      const languageImagesData = imagesData[language];
      const signedUrls = initiateResult.imagesToUpload[language];

      for (let i = 0; i < languageImagesData.length; i++) {
        const imageData = languageImagesData[i];
        const { signedUrl } = signedUrls[i];

        uploadPromises.push(
          (async () => {
            const { data: response, error } = await retryPromise(
              async () => {
                const uploadResponse = await fetch(signedUrl, {
                  method: 'PUT',
                  body: imageData.buffer,
                  headers: {
                    'Content-Type': 'image/webp' // or determine from buffer
                  }
                });

                if (!uploadResponse.ok) {
                  throw new Error(`Upload failed with status ${uploadResponse.status}`);
                }

                return uploadResponse;
              },
              3,
              5000,
              (response) => !response.ok
            );

            if (error) {
              throw error;
            }

            uploadedCount++;
            progressCallback?.({
              stage: 'uploading',
              completed: uploadedCount,
              total: totalImages,
              message: `Uploaded ${uploadedCount}/${totalImages} images`
            });
          })()
        );
      }
    }

    // Execute all uploads
    await Promise.all(uploadPromises);

    // Step 4: Finalize chapter creation
    progressCallback?.({
      stage: 'finalizing',
      completed: totalImages + 1,
      total: totalImages + 2,
      message: 'Saving chapter to database...'
    });

    // Build chapter data with uploaded image paths
    const processedImages = languages.map(language => ({
      language,
      images: initiateResult.imagesToUpload![language].map(img => ({
        src: img.s3Path,
        width: img.width,
        height: img.height
      }))
    }));

    const chapterData = {
      id: initiateResult.chapterId,
      number: data.number,
      titles: data.titles.map(title => ({
        ...title,
        language: title.language as ChapterLanguage
      })),
      mangaId: initiateResult.mangaId!,
      images: processedImages,
      languages
    };

    const finalizeResult = await finalizeChapterCreation(chapterData);

    if (!finalizeResult.success) {
      // Clean up uploaded images on failure
      const imagePaths = Object.values(initiateResult.imagesToUpload!)
        .flat()
        .map(img => img.s3Path);

      await deleteChapterImagesServerAction(imagePaths);

      return {
        success: false,
        message: finalizeResult.message || 'Failed to finalize chapter creation'
      };
    }

    progressCallback?.({
      stage: 'finalizing',
      completed: totalImages + 2,
      total: totalImages + 2,
      message: 'Chapter created successfully!'
    });

    return {
      success: true,
      message: 'Chapter created successfully',
      chapterId: initiateResult.chapterId,
      imagesProcessed: totalImages,
      totalImages
    };

  } catch (error) {
    console.error('Error in createChapterEnhanced:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}