import {headers} from "next/headers";
import ChapterMetadataModel from "@/app/lib/models/ChapterMetadata";
import {MetadataSchema} from "@/app/lib/utils/zodSchemas";
import dbConnect from "@/app/lib/utils/dbConnect";
import {ContentItemRaw} from "@/app/lib/graphql/schema";
import {LocaleEnum} from "@/app/types";

const OCR_API_KEY = process.env.OCR_API_TOKEN;

export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const apiKey = headersList.get("x-api-key");

    if (apiKey !== OCR_API_KEY)
      return new Response("Invalid api key", {status: 403});

    const body = await req.json();
    const {chapterId, data} = body;

    console.log({body});

    if (!chapterId || !data)
      return new Response("Invalid data", {status: 400});

    const result = MetadataSchema.safeParse(data);

    if (result.error)
      return new Response("Invalid data", {status: 400});

    const PROCESSED_LANGUAGE = "en" as LocaleEnum;

    // Flattening and filtering empty texts
    const processedData: ContentItemRaw[] = result.data
      .flat()
      .filter(item => (item.translatedTexts[0] && item.translatedTexts[0].text)) // Delete empty texts
      .map(item => ({
        ...item,
        coords: [{
          ...item.coords[0],
          language: PROCESSED_LANGUAGE
        }],
        translatedTexts: [{
          ...item.translatedTexts[0],
          language: PROCESSED_LANGUAGE
        }],
      })); // Rewrite miss typed languages to PROCESSED_LANGUAGE

    await dbConnect();
    const existingMetadata = await ChapterMetadataModel.findOne({chapterId});

    // Edit the existing metadata or create new one of there wasn't
    if (existingMetadata) {
      existingMetadata.content = processedData;
      await existingMetadata.save();
    } else {
      const newMetadata = new ChapterMetadataModel({
        chapterId,
        content: processedData
      });
      await newMetadata.save();
    }

    return new Response("Metadata successfully saved", {status: 200});
  } catch (e) {
    console.error(e);
    return new Response("Internal server error", {status: 500});
  }
}