import Manga from "@/app/models/Manga";
import {NextResponse} from "next/server";
import {HydratedDocument} from "mongoose";
import {MangaDB} from "@/app/types";
import {MangaSchema} from "@/app/lib/zodSchemas";

export async function GET (req: Request, {params}: {params: {id: string}}) {
  try {
    const mangas: HydratedDocument<MangaDB>[] = await Manga.find();

    return NextResponse.json(mangas);
  } catch(e) {
    console.error(e);
    return NextResponse.json({message: "Server error on getting mangas"}, {status: 500})
  }
}

export async function POST (req: Request) {
  try {
    const body = await req.json();
    const validatedBody = MangaSchema.safeParse(body);

    if (!validatedBody.success) {
      return NextResponse.json({message: "Unaccepted form of the body"}, {status: 400});
    }

    // Checking if manga with this title already exists
    if (await Manga.findOne({title: validatedBody.data.title})){
      return NextResponse.json({message: "Manga with this title already exists"}, {status: 400});
    }

    const manga = new Manga(validatedBody.data);

    await manga.save();

    return NextResponse.json(manga);
  } catch(e) {
    console.error(e);
    return NextResponse.json({message: "Server error on creating new manga"}, {status: 500})
  }
}