"use server"

import {LocaleType} from "@/app/types";
import {auth} from "@/auth";
import dbConnect from "@/app/lib/utils/dbConnect";
import ChapterModel from "@/app/lib/models/Chapter"

interface SaveChapterTitlesInput {
  id: string,
  titles: {
    title: string,
    language: LocaleType
  }[]
}

export async function saveChaptersTitles(chaptersToUpdate: SaveChapterTitlesInput[]): Promise<void> {
  try {
    const session = await auth();
    if (!session || (session.user.role !== "MODERATOR" && session.user.role !== "ADMIN")) {
      console.warn("Forbidden action: User does not have permission to save chapter titles.");
      throw new Error("Forbidden action");
    }

    if (!chaptersToUpdate || chaptersToUpdate.length === 0) {
      return;
    }

    await dbConnect();

    const bulkOps: any[] = []; // Array to hold bulk operations

    for (const chapterData of chaptersToUpdate) {
      if (!chapterData.id || !chapterData.titles || chapterData.titles.length === 0) {
        console.warn(`Skipping chapter update due to missing ID or titles: ${JSON.stringify(chapterData)}`);
        continue; // Skip if essential data is missing
      }

      const chapterId = chapterData.id;

      for (const titleInfo of chapterData.titles) {
        let { language, title } = titleInfo;

        // Transform en => En
        language = language[0].toUpperCase() + language.slice(1);

        // Operation 1: Update existing title if language matches
        bulkOps.push({
          updateOne: {
            filter: {
              id: chapterId, // Find the correct chapter
              "titles.language": language // Find the version within the array by language
            },
            update: {
              // $set updates the field of the matched array element
              $set: { "titles.$.value": title }
            }
            // 'versions.$' refers to the first element matched by the filter in the versions array
          }
        });

        // Operation 2: Add new version object if language does NOT exist
        bulkOps.push({
          updateOne: {
            filter: {
              id: chapterId, // Find the correct chapter
              "titles.language": { $ne: language } // Only match if NO version with this language exists
            },
            update: {
              // $push adds a new element to the array
              $push: {
                titles: {
                  language: language,
                  value: title,
                }
              }
            }
          }
        });
      }
    }

    if (bulkOps.length > 0) {
      console.log(`Executing ${bulkOps.length} bulk operations.`);
      // Execute all operations
      // ordered: false -> continues processing even if one operation fails
      const result = await ChapterModel.bulkWrite(bulkOps, { ordered: false });
      console.log("Bulk write result:", JSON.stringify(result.getRawResponse(), null, 2)); // Log summary

      // Optional: Check for errors in the bulk write result
      if (result.hasWriteErrors()) {
        console.error("Errors occurred during bulk write:", result.getWriteErrors());
        // Decide if you want to throw an error here or just log it
        // throw new Error("Some chapter titles could not be saved.");
      }

    } else {
      console.log("No valid operations to perform.");
    }

    console.log("saveChaptersTitles completed successfully.");

  } catch (e: any) { // Catch specific error types if needed
    console.error("Error in saveChaptersTitles:", e);
    // Re-throw the error to be handled by the caller or global error handler
    throw new Error(`Failed to save chapter titles: ${e.message}`);
  }
}