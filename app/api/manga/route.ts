import Manga from "@/app/models/Manga";
import {NextResponse} from "next/server";

export async function GET (req: Request, {params}: {params: {id: string}}) {
  try {

  } catch(e) {
    console.log(e);
    return NextResponse.json({message: "Server error on "}, {status: 500})
  }
}