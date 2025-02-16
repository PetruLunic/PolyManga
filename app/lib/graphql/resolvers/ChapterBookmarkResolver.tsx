import {Chapter, ChapterBookmark, Manga} from "@/app/lib/graphql/schema";
import ChapterBookmarkModel from "@/app/lib/models/ChapterBookmark"
import {Arg, Authorized, Ctx, FieldResolver, Mutation, Query, Resolver, Root} from "type-graphql";
import type {ApolloContext} from "@/app/api/graphql/route";
import {GraphQLError} from "graphql/error";
import ChapterModel from "@/app/lib/models/Chapter";
import MangaModel from "@/app/lib/models/Manga";


@Resolver(() => ChapterBookmark)
export class ChapterBookmarkResolver {
  // @Authorized(["USER", "MODERATOR"])
  @Query(() => ChapterBookmark, { nullable: true })
  async getBookmarkedChapter(@Arg("slug") slug: string, @Ctx() ctx: ApolloContext): Promise<ChapterBookmark | null> {
    const manga = await MangaModel.findOne({slug}).lean();

    if (!manga) {
      throw new GraphQLError("Manga not found", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    const bookmark: ChapterBookmark | null = await ChapterBookmarkModel.findOne({userId: ctx.user?.id, mangaId: manga.id}).lean();

    if (!bookmark) {
      throw new GraphQLError("Bookmark not found", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    return bookmark;
  }

  @Authorized(["USER", "MODERATOR"])
  @Mutation(() => ChapterBookmark, { nullable: true })
  async addChapterBookmark(@Arg("chapterId") chapterId: string, @Ctx() ctx: ApolloContext): Promise<ChapterBookmark | null> {
    const chapter: Chapter | null = await ChapterModel.findOne({id: chapterId});

    if (!chapter) {
      throw new GraphQLError("Chapter not found", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    // If there is an old bookmark then delete it
    await ChapterBookmarkModel.findOneAndDelete({userId: ctx.user?.id, mangaId: chapter.mangaId});

    // Create new bookmark
    const newBookmark = new ChapterBookmarkModel({chapterId, mangaId: chapter.mangaId, userId: ctx.user?.id});
    await newBookmark.save();

    return newBookmark;
  }

  @Authorized(["USER", "MODERATOR"])
  @Mutation(() => ChapterBookmark, { nullable: true })
  async deleteChapterBookmark(@Arg("chapterId") chapterId: string, @Ctx() ctx: ApolloContext): Promise<ChapterBookmark | null> {
    return ChapterBookmarkModel.findOneAndDelete({chapterId: chapterId, userId: ctx.user?.id});
  }

  @FieldResolver(() => Manga, {nullable: true})
  async manga(@Root() bookmark: ChapterBookmark): Promise<Manga | null> {
    return MangaModel.findOne({id: bookmark.mangaId}).lean();
  }

  @FieldResolver(() => Chapter, {nullable: true})
  async chapter(@Root() bookmark: ChapterBookmark): Promise<Chapter | null> {
    return ChapterModel.findOne({id: bookmark.chapterId}).lean();
  }
}
