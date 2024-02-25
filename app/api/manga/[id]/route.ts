import {NextResponse} from "next/server";
import {Manga as IManga, Chapter as IChapter} from "@/app/types";
import {ChapterSchema, ObjectIdSchema} from "@/app/lib/zodSchemas";
import Chapter from "@/app/models/Chapter";
import Manga from "@/app/models/Manga";
import {HydratedDocument} from "mongoose";


export async function GET(req: Request, {params}: {params: {id: string}}) {
  try{
    const {id} = params;
    const validatedId = ObjectIdSchema.safeParse(id);

    if (!validatedId.success) {
      return NextResponse.json({message: "Unaccepted form of the id"}, {status: 400});
    }

    const manga: HydratedDocument<IManga> | null = await Manga.findById(validatedId);

    if (!manga) {
      return NextResponse.json("Manga not found", {status: 400});
    }

    return NextResponse.json(manga);
  } catch (e) {
    console.log(e)
    return NextResponse.json({message: "Server error on get manga by id"}, {status: 500});
  }
}

export async function POST (req: Request, {params}: {params: {id: unknown}}) {
  try {
    // Getting id from dynamic params and validating it
    const {id} = params;
    const validatedId = ObjectIdSchema.safeParse(id);

    if (!validatedId.success) {
      return NextResponse.json({message: "Unaccepted form of the id"}, {status: 400});
    }

    // Getting body from request and validating it
    const body = await req.json();
    const validatedBody = ChapterSchema.safeParse(body);

    if (!validatedBody.success) {
      return NextResponse.json({message: "Unaccepted form of the body"}, {status: 400});
    }

    // Getting manga by validated id
    const manga: HydratedDocument<IManga> | null = await Manga.findById(validatedId.data);

    if (!manga)
      return NextResponse.json("Manga not found", {status: 400});

    // Creating new chapter from validated body
    const chapter: HydratedDocument<IChapter> = new Chapter(validatedBody.data);

    // Pushing chapter to the manga
    manga.chapters.push(chapter);

    await manga.save();

    return NextResponse.json(chapter);
  } catch(e) {
    console.log(e);
    return NextResponse.json({message: "Server error on adding chapter"}, {status: 500})
  }
}