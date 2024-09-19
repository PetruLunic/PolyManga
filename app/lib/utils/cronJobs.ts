import cron from "node-cron";
import Manga from "@/app/lib/models/Manga";

// Reset daily views at midnight (00:00)
cron.schedule('0 0 * * *', async () => {
  console.log('Resetting weekly views...');
  await Manga.updateMany({}, { "stats.dailyViews": 0 });
  console.log('Weekly views reset');
});

// Reset weekly views every Sunday at midnight (00:00)
cron.schedule('0 0 * * 0', async () => {
  console.log('Resetting weekly views...');
  await Manga.updateMany({}, { "stats.weeklyViews": 0 });
  console.log('Weekly views reset');
});

// Reset monthly views on the 1st of every month at midnight
cron.schedule('0 0 1 * *', async () => {
  console.log('Resetting monthly views...');
  await Manga.updateMany({}, { "stats.monthlyViews": 0 });
  console.log('Monthly views reset');
});