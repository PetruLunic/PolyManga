import {Arg, Args, FieldResolver, ID, Int, Mutation, Query, Resolver, Root} from "type-graphql";
import {AddChapterInput, Chapter, ChapterMetadataRaw, GetChaptersArgs, Manga} from "@/app/lib/graphql/schema";
import ChapterModel from "@/app/lib/models/Chapter";
import {GraphQLError} from "graphql/error";
import {HydratedDocument} from "mongoose";
import MangaModel from "@/app/lib/models/Manga";
import {deleteImage} from "@/app/lib/utils/awsUtils";
import ChapterMetadataModel from "@/app/lib/models/ChapterMetadata";
import {fetchInBatches} from "@/app/lib/utils/fetchInBatches";
import {LogExecutionTime} from "@/app/lib/utils/decorators";
import {DEFAULT_LANGUAGE} from "@/app/lib/utils/constants";

@Resolver(Chapter)
export class ChapterResolver {
  @Query(() => [Chapter])
  async chapters(
    @Arg("slug") slug: string,
    @Arg("limit", () => Int) limit: number
  ): Promise<Chapter[]> {
    const result = await MangaModel.aggregate([
      {
        $match: { slug: slug } // Match the Manga by its slug
      },
      {
        $lookup: { // Perform a left outer join with the ChapterModel
          from: 'chapters', // The collection name of the ChapterModel
          let: { mangaId: '$id' }, // Define a variable for the Manga's _id
          pipeline: [
            {
              $match: { // Filter chapters
                $expr: {
                  $and: [
                    { $eq: ['$mangaId', '$$mangaId'] }, // Match the mangaId
                  ]
                }
              }
            },
            { $limit: limit } // Limit to 1 result
          ],
          as: 'chapters' // The field to store the matching chapters
        }
      },
      {
        $unwind: { // Deconstruct the chapters array
          path: '$chapters',
          preserveNullAndEmptyArrays: false // If no chapter is found, return null
        }
      },
      {
        $replaceRoot: { // Replace the root document with the chapter
          newRoot: '$chapters'
        }
      }
    ]).exec();

    return result;
  }

  @LogExecutionTime()
  @Query(() => Chapter)
  async chapter(
    @Arg("number") number: number,
    @Arg("slug") slug: string,
  ): Promise<Chapter> {
    const result = await MangaModel.aggregate([
      {
        $match: { slug: slug } // Match the Manga by its slug
      },
      {
        $lookup: { // Perform a left outer join with the ChapterModel
          from: 'chapters', // The collection name of the ChapterModel
          let: { mangaId: '$id' }, // Define a variable for the Manga's _id
          pipeline: [
            {
              $match: { // Filter chapters
                $expr: {
                  $and: [
                    { $eq: ['$mangaId', '$$mangaId'] }, // Match the mangaId
                    { $eq: ['$number', number] } // Match the chapter number
                  ]
                }
              }
            },
            { $limit: 1 } // Limit to 1 result
          ],
          as: 'chapters' // The field to store the matching chapters
        }
      },
      {
        $unwind: { // Deconstruct the chapters array
          path: '$chapters',
          preserveNullAndEmptyArrays: false // If no chapter is found, return null
        }
      },
      {
        $replaceRoot: { // Replace the root document with the chapter
          newRoot: '$chapters'
        }
      }
    ]).exec();

    const chapter = result[0];

    if (!chapter) {
      throw new GraphQLError("Chapter not found", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      });
    }

    return chapter;
  }

  @LogExecutionTime()
  @Query(() => [Chapter])
  async latestChapters(@Args() {limit = 10, offset = 0}: GetChaptersArgs): Promise<Chapter[]> {
    return ChapterModel.aggregate([
      // Step 1: Sort by mangaId and createdAt (newest first)
      { $sort: { mangaId: 1, createdAt: -1 } },

      // Step 2: Group by mangaId, keeping only the newest chapter (one per mangaId)
      {
        $group: {
          _id: "$mangaId",   // Group by bookId
          latestChapter: { $first: "$$ROOT" }  // Get the most recent chapter for each mangaId
        }
      },

      // Step 3: Replace root to get the original document format
      { $replaceRoot: { newRoot: "$latestChapter" } },

      // Step 4: Sort the final result by createdAt in descending order
      { $sort: { createdAt: -1 } },
      { $skip: offset }, // Skip documents for pagination
      { $limit: limit }, // Limit the number of documents returned
    ]).exec();
  }

  @Mutation(() => Chapter)
  async addChapter(@Arg("chapter") chapterInput: AddChapterInput): Promise<Chapter> {
    const manga = await MangaModel.findOne({id: chapterInput.mangaId});

    if (!manga) {
      throw new GraphQLError("Manga not found", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    if (manga.isDeleted || manga.isBanned) {
      throw new GraphQLError("This manga is deleted or banned", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    // Check if manga has the chapter with the same number
    const hasTheSameNumber = await ChapterModel.find({id: {$in: manga.chapters}, number: chapterInput.number})
        .then(res => !!res.length)

    if (hasTheSameNumber) {
      throw new GraphQLError("Chapters in the same manga cannot have the same order number", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    const chapter: HydratedDocument<Chapter> = new ChapterModel(chapterInput);
    await chapter.save();

    manga.chapters.push(chapter.id);
    await manga.save();

    return chapter;
  }

  @Mutation(() => String)
  async deleteChapters(
      @Arg("slug") slug: string,
      @Arg("ids", () => [ID]) ids: string[]): Promise<string> {
    const chapters: HydratedDocument<Chapter>[] = await ChapterModel.find({id: {$in: ids}});

    if (!chapters.length) {
      throw new GraphQLError("Chapters not found", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    const manga = await MangaModel.findOne({slug})

    if (!manga) {
      throw new GraphQLError("Manga not found", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    const deletePromises = chapters.flatMap(chapter =>
      chapter.images.flatMap(images =>
        images.images.flatMap(img => deleteImage(img.src))
      )
    ).filter(promise => !!promise);

    await fetchInBatches(deletePromises, 40);

    // Delete every chapter document
    for (let chapter of chapters) {
      await chapter.deleteOne();
    }

    // Delete chapters id from manga
    manga.chapters = manga.chapters.filter(id => !ids.includes(id))
    await manga.save();

    return manga.id;
  }

  // Check if the chapter is the first
  @FieldResolver(() => Boolean)
  async isFirst(@Root() chapter: Chapter): Promise<boolean> {
    return ChapterModel.find({mangaId: chapter.mangaId})
        .then((res: Chapter[]) =>
          !res.some(ch => ch.number < chapter.number)
        )
  }

  // Check if the chapter is the last
  @FieldResolver(() => Boolean)
  async isLast(@Root() chapter: Chapter): Promise<boolean> {
    return ChapterModel.find({mangaId: chapter.mangaId})
        .then((res: Chapter[]) =>
            !res.some(ch => ch.number > chapter.number)
        )
  }

  @FieldResolver(() => Chapter, { nullable: true })
  async nextChapter(@Root() chapter: Chapter): Promise<Chapter | null> {
    return ChapterModel.findOne({
      mangaId: chapter.mangaId,
      number: { $gt: chapter.number }
    })
      .sort({ number: 1 })
      .select('number')
      .lean();
  }

  @FieldResolver(() => Chapter, { nullable: true })
  async prevChapter(@Root() chapter: Chapter): Promise<Chapter | null> {
    return ChapterModel.findOne({
      mangaId: chapter.mangaId,
      number: { $lt: chapter.number }
    })
      .sort({ number: -1 })
      .select('number')
      .lean();
  }

  @FieldResolver(() => String)
  title(
    @Root() chapter: Chapter,
    @Arg("locale", () => String, {defaultValue: DEFAULT_LANGUAGE}) locale: string
  ): string {
    return chapter.titles.find(({language}) => locale === language.toLowerCase())?.value
      ?? chapter.titles.find(({language}) => DEFAULT_LANGUAGE === language.toLowerCase())?.value
      ?? chapter.titles[0].value;
  }

  @LogExecutionTime()
  @FieldResolver(() => Manga)
  async manga(@Root() chapter: Chapter): Promise<Manga | null> {
    return MangaModel.findOne({id: chapter.mangaId}).lean();
  }

  @LogExecutionTime()
  @FieldResolver(() => ChapterMetadataRaw, {nullable: true})
  async metadata(@Root() chapter: Chapter): Promise<ChapterMetadataRaw | null> {
    return ChapterMetadataModel.findOne({chapterId: chapter.id}).lean();
  }
}