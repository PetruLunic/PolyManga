import {Chapter, ChapterBookmark} from "@/app/lib/graphql/schema";
import ChapterBookmarkModel from "@/app/lib/models/ChapterBookmark"
import {Arg, Authorized, Ctx, Mutation, Query, Resolver} from "type-graphql";
import type {ApolloContext} from "@/app/api/graphql/route";
import {GraphQLError} from "graphql/error";
import ChapterModel from "@/app/lib/models/Chapter";


@Resolver(() => ChapterBookmark)
export class ChapterBookmarkResolver {
  @Authorized(["USER", "MODERATOR"])
  @Query(() => ChapterBookmark, { nullable: true })
  async getBookmarkedChapter(@Arg("mangaId") mangaId: string, @Ctx() ctx: ApolloContext): Promise<ChapterBookmark | null> {
    const bookmark: ChapterBookmark | null = await ChapterBookmarkModel.findOne({userId: ctx.user?.id, mangaId}).lean();

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
    const deletedBookmark = await ChapterBookmarkModel.findOneAndDelete({userId: ctx.user?.id, mangaId: chapter.mangaId});

    console.log("Deleted bookmark: ", deletedBookmark);

    // Create new bookmark
    const newBookmark = new ChapterBookmarkModel({chapterId, mangaId: chapter.mangaId, userId: ctx.user?.id});
    console.log("New bookmark: ", newBookmark);
    await newBookmark.save();

    return newBookmark;
  }

  @Authorized(["USER", "MODERATOR"])
  @Mutation(() => ChapterBookmark, { nullable: true })
  async deleteChapterBookmark(@Arg("chapterId") chapterId: string, @Ctx() ctx: ApolloContext): Promise<ChapterBookmark | null> {
    return ChapterBookmarkModel.findOneAndDelete({chapterId: chapterId, userId: ctx.user?.id});  }
}
