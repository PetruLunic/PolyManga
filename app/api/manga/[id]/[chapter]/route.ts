import {NextResponse} from "next/server";
import Manga from "@/app/models/Manga";
import {Manga as IManga, MangaDB} from "@/app/types";
import {HydratedDocument} from "mongoose";
import Chapter from "@/app/models/Chapter";
import {Chapter as IChapter} from "@/app/types"
import {ObjectIdSchema} from "@/app/lib/zodSchemas";

export async function GET (req: Request, {params}: {params: {chapter: string, id: string}}) {
  try {
    const {chapter: number, id} = params;
    const validatedId = ObjectIdSchema.safeParse(id);

    if (!validatedId.success) {
      return NextResponse.json({message: "Unaccepted form of the id"}, {status: 400});
    }

    const manga: HydratedDocument<MangaDB> | null = await Manga.findById(validatedId.data);

    if (!manga)
      return NextResponse.json("Manga not found", {status: 400});

    // If there is no such chapter in manga
    if (parseInt(number) >= manga.chapters.length || parseInt(number) < 0) {
      return NextResponse.json({message: "Chapter not found"}, {status: 400});
    }

    // Getting id from manga.chapters array
    const chapterId = manga.chapters[parseInt(number)];

    // Getting chapter by id
    const chapter: HydratedDocument<IChapter> | null = await Chapter.findById(chapterId);

    if (!chapter) {
      return NextResponse.json({message: "Chapter not found"}, {status: 400});
    }

    return NextResponse.json(chapter)
  } catch(e) {
    console.error(e);
    return NextResponse.json({message: "Server error on get chapter"}, {status: 500})
  }
}