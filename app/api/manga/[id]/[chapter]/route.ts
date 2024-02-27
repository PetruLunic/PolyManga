import {NextResponse} from "next/server";
import Manga from "@/app/lib/models/Manga";
import {Manga as IManga} from "@/app/types";
import {HydratedDocument} from "mongoose";
import Chapter from "@/app/lib/models/Chapter";
import {Chapter as IChapter} from "@/app/types"

export async function GET (req: Request, {params}: {params: {chapter: string, id: string}}) {
  try {
    const {chapter: number, id} = params;

    const manga: HydratedDocument<IManga> | null = await Manga.findOne({id});

    if (!manga)
      return NextResponse.json({message: "Manga not found"}, {status: 400});

    // If there is no such chapter in manga
    if (parseInt(number) >= manga.chapters.length || parseInt(number) < 0) {
      return NextResponse.json({message: "Chapter not found"}, {status: 400});
    }

    // Getting id from manga.chapters array
    const chapterId = manga.chapters[parseInt(number)];

    // Getting chapter by id
    const chapter: HydratedDocument<IChapter> | null = await Chapter.findOne({id: chapterId});

    if (!chapter) {
      return NextResponse.json({message: "Chapter not found"}, {status: 400});
    }

    return NextResponse.json(chapter)
  } catch(e) {
    console.error(e);
    return NextResponse.json({message: "Server error on get chapter"}, {status: 500})
  }
}