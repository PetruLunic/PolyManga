import {Arg, Args, FieldResolver, ID, Int, Mutation, Query, Resolver, Root} from "type-graphql";
import {AddChapterInput, Chapter, GetChaptersArgs, Manga} from "@/app/lib/graphql/schema";
import ChapterModel from "@/app/lib/models/Chapter";
import {GraphQLError} from "graphql/error";
import {HydratedDocument} from "mongoose";
import MangaModel from "@/app/lib/models/Manga";
import {ChapterLanguage} from "@/app/types";
import {deleteImage} from "@/app/lib/utils/awsUtils";
import {LogExecutionTime} from "@/app/lib/utils/decorators";

@Resolver(Chapter)
export class ChapterResolver {
  @Query(() => Chapter)
  async chapter(
    @Arg("number") number: number,
    @Arg("slug") slug: string,
  ): Promise<Chapter> {
    const manga = await MangaModel.findOne({slug});

    if (!manga) {
      throw new GraphQLError("Manga not found", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    const chapter: Chapter | null = await ChapterModel.findOne({number, mangaId: manga.id}).lean();

    if (!chapter) {
      throw new GraphQLError("Chapter not found", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    return chapter;
  }

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

    let promisesBatch: any[] = [];

    // Delete images from S3
    for (const chapter of chapters) {
      for (const version of chapter.versions) {
        for (const image of version.images) {
          // Pushing promise in the batch
          promisesBatch.push(deleteImage(image.src));

          // If promises length reach 50 units, then wait, resolve them, and starting next batch;
          if (promisesBatch.length > 50) {
            await Promise.all(promisesBatch);
            promisesBatch = [];
          }
        }
      }
    }

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

  @FieldResolver(() => Chapter, {nullable: true})
  async nextChapter(@Root() chapter: Chapter): Promise<Chapter | null> {
    const chapters: Chapter[] = await ChapterModel.find({mangaId: chapter.mangaId}).lean();

    return chapters
        .sort((ch1, ch2) => ch1.number - ch2.number)
        .find(ch => ch.number > chapter.number) || null
  }

  @FieldResolver(() => Chapter, {nullable: true})
  async prevChapter(@Root() chapter: Chapter): Promise<Chapter | null> {
    const chapters: Chapter[] = await ChapterModel.find({mangaId: chapter.mangaId}).lean();

    return chapters
        .sort((ch1, ch2) => ch2.number - ch1.number)
        .find(ch => ch.number < chapter.number) || null
  }

  @FieldResolver(() => [ChapterLanguage])
  async languages(@Root() chapter: Chapter): Promise<ChapterLanguage[]> {
    return chapter.versions.map(version => version.language);
  }

  @FieldResolver(() => Manga)
  async manga(@Root() chapter: Chapter): Promise<Manga | null> {
    return MangaModel.findOne({id: chapter.mangaId}).lean();
  }
}