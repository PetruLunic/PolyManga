import {headers} from "next/headers";
import ChapterMetadataModel from "@/app/lib/models/ChapterMetadata";
import {MetadataSchema} from "@/app/lib/utils/zodSchemas";
import dbConnect from "@/app/lib/utils/dbConnect";

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

    const processedData = result.data.flat();

    await dbConnect();
    const existingMetadata = await ChapterMetadataModel.findOne({chapterId});

    // Edit the existing metadata or create new one of there wasn't
    if (existingMetadata) {
      // @ts-ignore
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