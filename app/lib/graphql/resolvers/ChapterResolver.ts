import {Arg, FieldResolver, ID, Mutation, Query, Resolver, Root} from "type-graphql";
import {AddChapterInput, Chapter} from "@/app/lib/graphql/schema";
import ChapterModel from "@/app/lib/models/Chapter";
import {GraphQLError} from "graphql/error";
import {HydratedDocument} from "mongoose";
import MangaModel from "@/app/lib/models/Manga";

@Resolver(Chapter)
export class ChapterResolver {
  @Query(() => Chapter)
  async chapter(@Arg("id", () => ID) id: string): Promise<Chapter> {
    const chapter: Chapter | null = await ChapterModel.findOne({id}).lean();

    if (!chapter) {
      throw new GraphQLError("Chapter not found", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    return chapter;
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
  async deleteChapter(@Arg("id", () => ID) id: string): Promise<string> {
    const chapter: HydratedDocument<Chapter> | null = await ChapterModel.findOne({id});

    if (!chapter) {
      throw new GraphQLError("Chapter not found", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    await chapter.deleteOne();

    const manga = await MangaModel.findOne({id: chapter.mangaId})

    if (!manga) {
      throw new GraphQLError("Manga not found", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    await manga.save();

    return id;
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
        .sort((ch1, ch2) => ch1.number - ch2.number)
        .find(ch => ch.number < chapter.number) || null
  }
}