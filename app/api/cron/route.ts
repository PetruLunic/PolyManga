import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/utils/dbConnect";
import Manga from "@/app/lib/models/Manga";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json('Unauthorized', {
        status: 401,
      });
    }

    await dbConnect();

    const now = new Date();

    // Reset daily views at midnight
    if (now.getHours() === 0) {
      console.log(`[${now.toISOString()}] Resetting daily views...`);
      await Manga.updateMany({}, { "stats.dailyViews": 0 });
      console.log(`[${now.toISOString()}] Daily views reset.`);
    }

    // Reset weekly views every Sunday at midnight
    if (now.getDay() === 0 && now.getHours() === 0) {
      console.log(`[${now.toISOString()}] Resetting weekly views...`);
      await Manga.updateMany({}, { "stats.weeklyViews": 0 });
      console.log(`[${now.toISOString()}] Weekly views reset.`);
    }

    // Reset monthly views on the 1st of every month at midnight
    if (now.getDate() === 1 && now.getHours() === 0) {
      console.log(`[${now.toISOString()}] Resetting monthly views...`);
      await Manga.updateMany({}, { "stats.monthlyViews": 0 });
      console.log(`[${now.toISOString()}] Monthly views reset.`);
    }

    NextResponse.json({ message: "Cron tasks executed successfully." });
  } catch (error) {
    console.error("Error executing cron tasks:", error);
    NextResponse.json({ error }, {status: 500});
  }
}
