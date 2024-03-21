import {Arg, ID, Mutation, Query, Resolver} from "type-graphql";
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

    // Deleting id of the chapter from linked manga
    manga.chapters = manga.chapters.filter(chapter => chapter !== id);
    await manga.save();

    return id;
  }
}