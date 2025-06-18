import { NextRequest, NextResponse } from 'next/server';
import { ChapterLanguage } from '@/app/__generated__/graphql';
import {createChapter} from "@/app/(pages)/[locale]/manga/[id]/upload/actions";
import retryPromise from "@/app/lib/utils/retryPromise";
import {ChapterInput} from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/edit/_components/EditChapterForm";
import {cookies} from "next/headers";
import sharp from "sharp";

interface ScrapedChapter {
  title: string;
  number: number;
  images: string[]; // Array of image URLs
  mangaId: string;
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get("x-api-key");

    if (!apiKey || apiKey !== process.env.SCRAP_API_SECRET_KEY) {
      console.error(`Invalid API Key on /api/scrap/chapter. IP: ${request.headers.get('X-Forwarded-For') ?? request.headers.get('x-real-ip')}`);
      return NextResponse.json(
        { error: 'Invalid or missing API key' },
        { status: 401 }
      );
    }

    const body: ScrapedChapter = await request.json();
    const { title, number, images, mangaId } = body;

    // Validation
    if (!title || !number || !Array.isArray(images) || !mangaId) {
      return NextResponse.json(
        { error: 'Invalid request body. Required: title, number, images, mangaId' },
        { status: 400 }
      );
    }

    if (images.length === 0) {
      return NextResponse.json(
        { error: 'At least one image is required' },
        { status: 400 }
      );
    }

    // Create FormData and fetch images
    const formData = new FormData();
    const imagesMetadata: {
      buffer: ArrayBuffer,
      contentType: string
    }[] = [];

    console.log(`Processing ${images.length} images for chapter ${number}`);

    for (let i = 0; i < images.length; i++) {
      try {
        const imageUrl = images[i];

        if (!imageUrl || !imageUrl.startsWith('http')) {
          console.warn(`Invalid image URL at index ${i}: ${imageUrl}`);
          continue;
        }

        const {data: response} = await retryPromise(
          () => fetch(imageUrl),
          3,
          2000,
          (response) => !response.ok
        );

        if (!response?.ok) {
          console.error(`Failed to fetch image ${imageUrl}: ${response?.status}`);
          return NextResponse.json(
            { error: `Failed to fetch image ${imageUrl}: ${response?.status}` },
            { status: response?.status ?? 500 }
          );
        }

        imagesMetadata.push({
          buffer: await response.arrayBuffer(),
          contentType: response.headers.get('content-type') || 'image/jpeg'
        });
      } catch (error) {
        console.error(`Error fetching image ${i}:`, error);
      }
    }

    // Step 2: Filter using indexed approach
    const imageWidths = await Promise.all(
      imagesMetadata.map(async (metadata) => {
        const sharpMetadata = await sharp(metadata.buffer).metadata();
        return sharpMetadata.width || 0;
      })
    );

    // Find most common width
    const widthCounts: Record<number, number> = {};
    imageWidths.forEach(width => {
      widthCounts[width] = (widthCounts[width] || 0) + 1;
    });

    const mostCommonWidth = Object.keys(widthCounts)
      .map(Number)
      .reduce((a, b) => (widthCounts[a] > widthCounts[b] ? a : b), 0);

    // Step 3: Filter and create FormData based on width
    let filteredCount = 0;
    for (let i = 0; i < imagesMetadata.length; i++) {
      if (imageWidths[i] === mostCommonWidth) {
        const { buffer, contentType } = imagesMetadata[i];

        const extension = contentType.includes('png') ? 'png' :
          contentType.includes('webp') ? 'webp' : 'jpg';

        const file = new File([buffer], `image-${filteredCount}.${extension}`, {
          type: contentType
        });

        formData.append(`images-${ChapterLanguage.En}`, file);
        filteredCount++;
      }
    }

    console.log(`Created FormData with ${filteredCount} filtered images`);

    if (filteredCount === 0) {
      return NextResponse.json(
        { error: 'No images remained after banner filtering' },
        { status: 400 }
      );
    }


    // Prepare chapter input data
    const chapterInput: ChapterInput = {
      mangaId,
      titles: [{
        language: ChapterLanguage.En,
        value: title
      }],
      number,
      languages: ChapterLanguage.En,
      id: ""
    };

    // Set service authentication cookie
    const cookieStore = await cookies();
    cookieStore.set('service-auth', process.env.SCRAP_API_SECRET_KEY!);

    // Call your createChapter function
    const result = await createChapter(chapterInput, formData);

    console.log(result);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        imagesProcessed: filteredCount,
        totalImages: images.length
      }, { status: 201 });
    } else {
      return NextResponse.json({
        success: false,
        error: result.message
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error in POST /api/scrap/chapters:', error);

    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
