import {NextRequest, NextResponse} from "next/server";
import {Chapter as IChapter, MangaDB} from "@/app/types";
import {ChapterSchema} from "@/app/lib/zodSchemas";
import Chapter from "@/app/lib/models/Chapter";
import Manga from "@/app/lib/models/Manga";
import {HydratedDocument} from "mongoose";

export async function GET(req: NextRequest, {params}: {params: {id: string}}) {
  try{
    const {id} = params;
    const query = req.nextUrl.searchParams;

    const form = query.get("form");

    // Initializing manga as null
    let manga: HydratedDocument<MangaDB> | null = await Manga.getFull;

    // Getting different forms of manga
    if (form === "minimum") {
      manga = await Manga.findOne({id}, "title image chapters stats");
    } else {
      manga = await Manga.findOne({id});
    }

    if (!manga) {
      return NextResponse.json({message: "Manga not found"}, {status: 400});
    }

    manga.stats.visitors = manga.stats.visitors.length;

    return NextResponse.json(manga);
  } catch (e) {
    console.error(e)
    return NextResponse.json({message: "Server error on get manga by id"}, {status: 500});
  }
}

export async function POST (req: Request, {params}: {params: {id: string}}) {
  try {
    const {id} = params;

    // Getting body from request and validating it
    const body = await req.json();
    const validatedBody = ChapterSchema.safeParse(body);

    if (!validatedBody.success) {
      return NextResponse.json({message: "Unaccepted form of the body"}, {status: 400});
    }

    // Getting manga by validated id
    const manga: HydratedDocument<MangaDB> | null = await Manga.findOne({id});

    if (!manga)
      return NextResponse.json("Manga not found", {status: 400});

    // Creating new chapter from validated body
    const chapter: HydratedDocument<IChapter> = new Chapter(validatedBody.data);

    await chapter.save();

    // Pushing chapter to the manga
    manga.chapters.push(chapter.id);

    await manga.save();

    return NextResponse.json(chapter);
  } catch(e) {
    console.error(e);
    return NextResponse.json({message: "Server error on adding chapter"}, {status: 500})
  }
}