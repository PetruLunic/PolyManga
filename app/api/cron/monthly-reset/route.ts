import {NextRequest, NextResponse} from "next/server";
import dbConnect from "@/app/lib/utils/dbConnect";
import Manga from "@/app/lib/models/Manga";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json('Unauthorized', {
        status: 401,
      });
    }
    const result = await Manga.updateMany({}, { "stats.monthlyViews": 0 });

    return NextResponse.json(`[${new Date().toISOString()}] Monthly views reset. Updated ${result.modifiedCount} documents.`);
  } catch (e) {
    console.error(
      `[${new Date().toISOString()}] Error resetting monthly views:`,
      e
    );
    return NextResponse.json(`[${new Date().toISOString()}] Error resetting monthly views`, {status: 500});
  }
}