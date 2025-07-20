import { NextRequest, NextResponse } from 'next/server';
import { ChapterLanguage } from '@/app/__generated__/graphql';
import { ChapterInput } from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/edit/_components/EditChapterForm";
import { cookies } from "next/headers";
import {createChapter} from "@/app/(pages)/[locale]/manga/[id]/upload/createChapter";

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get("x-api-key");

    if (!apiKey || apiKey !== process.env.SCRAP_API_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Invalid or missing API key' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, number, images, mangaId } = body;

    // Validation
    if (!title || !number || !Array.isArray(images) || !mangaId) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Process images - convert to File objects with ArrayBuffer
    const processedFiles: File[] = [];
    let processedImages = 0;

    for (const imageUrl of images) {
      try {
        const response = await fetch(imageUrl);
        if (!response.ok) continue;

        const buffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'image/jpeg';
        const extension = contentType.includes('png') ? 'png' : 'jpg';

        const file = new File([buffer], `image-${processedImages}.${extension}`, {
          type: contentType
        });

        processedFiles.push(file);
        processedImages++;
      } catch (error) {
        console.error(`Error processing image ${imageUrl}:`, error);
      }
    }

    if (processedFiles.length === 0) {
      return NextResponse.json(
        { error: 'No images could be processed' },
        { status: 400 }
      );
    }

    // Set service authentication
    const cookieStore = await cookies();
    cookieStore.set('service-auth', process.env.SCRAP_API_SECRET_KEY!);

    // Prepare chapter input
    const chapterInput: ChapterInput = {
      mangaId,
      titles: [{ language: ChapterLanguage.En, value: title }],
      number,
      languages: ChapterLanguage.En,
      id: ""
    };

    // Prepare image files object
    const imageFiles: Record<ChapterLanguage, File[]> = {
      [ChapterLanguage.En]: processedFiles
    } as Record<ChapterLanguage, File[]>;

    const result = await createChapter(
      chapterInput,
      imageFiles,
      {
        progressCallback: (progress) => {
          console.log(`[${progress.stage}] ${progress.message} (${progress.completed}/${progress.total})`);
        }
      }
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        chapterId: result.chapterId,
        imagesProcessed: result.imagesProcessed,
        totalImages: result.totalImages
      }, { status: 201 });
    } else {
      return NextResponse.json({
        success: false,
        error: result.message
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error in chapter creation:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
