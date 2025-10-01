// app/api/ocr/get-chapter-ocr-data/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import Chapter from "@/app/lib/models/Chapter";
import dbConnect from "@/app/lib/utils/dbConnect"; // your session util

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || !["ADMIN", "MODERATOR"].includes(session.user.role)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 403 });
  }

  const { chapterIds, imagesLanguage } = await req.json();

  await dbConnect();

  // Fetch image URLs for all chapters
  const fetchedChapters = await Chapter.find({id: {$in: chapterIds}}, "id images").lean();
  const chapters = fetchedChapters.map(chapter => ({
    id: chapter.id,
    images: chapter.images.find(version => version.language.toLocaleLowerCase() === imagesLanguage.toLocaleLowerCase())?.images,
  }))
  // Return the protected OCR token from server .env
  return NextResponse.json({
    token: process.env.OCR_API_TOKEN,
    chapters
  });
}
