"use server"

import Manga from "@/app/lib/models/Manga";
import ChapterModel from "@/app/lib/models/Chapter";
import {Chapter} from "@/app/lib/graphql/schema";
import {chromium} from "playwright";
import {auth} from "@/auth";
import sharp from "sharp";
import {createChapter} from "@/app/(pages)/[locale]/manga/[id]/upload/actions";
import {ChapterLanguage} from "@/app/types";
import dbConnect from "@/app/lib/utils/dbConnect";

async function getLatestChapter(id: string): Promise<Chapter | null> {
  return ChapterModel.findOne({ mangaId: id })
    .sort({ number: -1 })
    .limit(1)
    .lean();
}

async function getFirstAndLastChapterToScrap(url: string): Promise<[number, number] | null> {
  try {
    // Launch a Chromium browser
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
      // Navigate to the URL
      await page.goto(url);

      const elements = await page.locator("h3.font-bold.text-xl > span").all();

      return [Number(await elements[0].textContent()), Number(await elements[1].textContent())];
    } finally {
      // Ensure the browser is closed after processing all URLs
      await browser.close();
      // Close the page after processing
      await page.close();
    }
  } catch (e) {
    console.error("Error at getting latest chapter to scrap: ", e);
    throw e;
  }
}

async function fetchImagesBuffer(urls: string[]): Promise<ArrayBuffer[] | undefined> {
  try {
    return Promise.all(urls.map(url => fetch(url).then(res => res.arrayBuffer())));
  } catch (error) {
    console.error(`Failed to download image from ${urls}:`, error);
    throw error;
  }
}

export interface ScrapedChapter {
  title: string,
  number: number,
  images: ArrayBuffer[]
}

export async function filterScrapedImageBanners(images: ArrayBuffer[]): Promise<ArrayBuffer[]> {
  try {
    // Step 1: Extract widths of all images
    const widths: number[] = await Promise.all(
      images.map(async (image) => {
        const metadata = await sharp(image).metadata();
        return metadata.width || 0; // Default to 0 if width is undefined
      })
    );

    // Step 2: Find the most common width
    const widthCounts: Record<number, number> = {};
    for (const width of widths) {
      widthCounts[width] = (widthCounts[width] || 0) + 1;
    }
    const mostCommonWidth = Object.keys(widthCounts)
      .map(Number)
      .reduce((a, b) => (widthCounts[a] > widthCounts[b] ? a : b), 0);

    // Step 3: Filter images with widths not different from the most common width
    const filteredImages: ArrayBuffer[] = [];
    for (let i = 0; i < images.length; i++) {
      if (widths[i] === mostCommonWidth) {
        filteredImages.push(images[i]);
      }
    }

    return filteredImages;
  } catch (e) {
    console.error("Error at filter image banners: ", e);
    throw e;
  }
}

export async function scrapeChapter(url: string): Promise<ScrapedChapter> {
  try {
    // Launch a Chromium browser
    const browser = await chromium.launch();

    try {
      const page = await browser.newPage();

      // Navigate to the URL
      await page.goto(url);

      // Extract title
      const title = await page.locator("h2.text-start.truncate").first().textContent();
      if (!title) throw new Error("Title not found");

      // Extract chapter number from the URL
      const urlArray = url.split("/");
      const number = Number(urlArray[urlArray.length - 1]);

      // Extract image URLs
      const imagesUrl = await page.$$eval("div.w-full.mx-auto.center > img.object-cover.mx-auto", imgs =>
        imgs.map(img => img.getAttribute("src") || "")
      );

      // Fetch image buffers
      const imagesBuffer = await fetchImagesBuffer(imagesUrl);
      if (!imagesBuffer) throw new Error("Images not found");

      const filteredImagesBuffer = await filterScrapedImageBanners(imagesBuffer);

      // Close the page after processing
      await page.close();

      return {
        title,
        number,
        images: filteredImagesBuffer,
      }
    } finally {
      // Ensure the browser is closed after processing all URLs
      await browser.close();
    }
  } catch (error) {
    console.error("Scraping error:", error);
    throw error;
  }
}

export default async function scrapManga(slug: string, url: string) {
  try {
    const session = await auth();

    // This action can use only moderators and admins
    if (!session || (session.user.role !== "MODERATOR" && session.user.role !== "ADMIN")) {
      throw new Error("Forbidden action");
    }

    await dbConnect();
   const manga = await Manga.findOne({slug}).lean();

    if (!manga) {
      throw new Error(`${slug} not found`)
    }

    console.log("chapters: ", manga.chapters);

    const latestChapterNumber = await getLatestChapter(manga.id).then(res => res?.number);
    const chapterNumbersToScrap = await getFirstAndLastChapterToScrap(url);

    if (!chapterNumbersToScrap) {
      throw new Error("Chapter numbers to scrap not found");
    }

    // Getting starting point of chapters scraping
    const startingChapterToScrap = latestChapterNumber
      ? latestChapterNumber < chapterNumbersToScrap[1]
        ? latestChapterNumber + 1
        : null
      : chapterNumbersToScrap[0]

    console.log("Latest chapter number: ", latestChapterNumber)
    console.log("starting chapter number: ", startingChapterToScrap);
    console.log("chapters number to scrap: ", chapterNumbersToScrap)

    if (startingChapterToScrap === null) {
      return `${manga.title} already full.`;
    }

    // Generate chapters urls to scrap
    const urlsToScrap = Array.from({length: chapterNumbersToScrap[1] - startingChapterToScrap + 1}, (_, index) => `${url}/chapter/${startingChapterToScrap + index}`);

    for (let i = 0; i < urlsToScrap.length; i++){
      console.log("Scrap url: ", urlsToScrap[i]);
      const scrapedChapter = await scrapeChapter(urlsToScrap[i]);

      console.log("Scraped chapter: ", scrapedChapter);

      if (!scrapedChapter) {
        console.error(`${manga.slug} ${urlsToScrap[i]} not found`);
        continue;
      }

      const images = scrapedChapter.images.map((buffer, index) => new File([buffer], `img-${index}`));

      if (images.length === 0) {
        i--;
        console.warn(`No image found for ${urlsToScrap[i]} chapter`)
        await new Promise(resolve => setTimeout(() => resolve("f"), 2000));
        continue;
      }

      const formData = new FormData();

      images.forEach(img => {
        formData.append(`images-${ChapterLanguage.En}`, img)
      })

      await createChapter({
        number: scrapedChapter.number,
        titles: [{
          language: ChapterLanguage.En,
          value: scrapedChapter.title
        }],
        mangaId: slug,
        languages: ChapterLanguage.En,
        id: ""
      }, formData)
    }
  } catch (e) {
    console.error("Error at scraping manga: ", e);
    throw e;
  }
}