import {Arg, Authorized, Ctx, FieldResolver, Mutation, Query, Resolver, Root} from "type-graphql";
import {AddBookmarkInput, Bookmark, Manga} from "@/app/lib/graphql/schema";
import MangaModel from "@/app/lib/models/Manga";
import BookmarkModel from "@/app/lib/models/Bookmark";
import {GraphQLError} from "graphql/error";
import {BookmarkType, bookmarkTypes} from "@/app/types";
import {HydratedDocument} from "mongoose";
import {type ApolloContext} from "@/app/api/graphql/route";

@Resolver(() => Bookmark)
export class BookmarkResolver {

  @Authorized(["USER", "MODERATOR"])
  @Query(() => String, {nullable: true})
  async isBookmarked(@Arg("mangaId") mangaId: string, @Ctx() ctx: ApolloContext): Promise<BookmarkType | null> {
    const bookmark: HydratedDocument<Bookmark> | null = await BookmarkModel.findOne({userId: ctx.user?.id}).lean();

    if (!bookmark) {
      throw new GraphQLError("Bookmark not found", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    let bookmarkType: BookmarkType | null = null;

    // Iterate through every bookmark and check if there is mangaId
    bookmarkTypes.forEach(type => {
      if (bookmark[type].includes(mangaId)) {
        bookmarkType = type;
      }
    })

    return bookmarkType;
  }

  @Authorized(["USER", "MODERATOR"])
  @Mutation(() => Bookmark, {nullable: true})
  async addBookmark(@Arg("input") {type, mangaId}: AddBookmarkInput, @Ctx() ctx: ApolloContext): Promise<Bookmark | null> {
    // If passed type of bookmark does not exist
    if (!bookmarkTypes.includes(type)) {
      throw new GraphQLError("This type of bookmark does not exist", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    const bookmark: HydratedDocument<Bookmark> | null = await BookmarkModel.findOne({userId: ctx.user?.id});

    if (!bookmark) {
      throw new GraphQLError("Bookmark not found", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    const manga = await MangaModel.findOne({id: mangaId});

    if (!manga) {
      throw new GraphQLError("Manga not found", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    // If there is already manga in this type of bookmark then do nothing
    if (bookmark[type].find(id => id === mangaId)) {
      return bookmark.toObject();
    }

    // Deleting manga from every bookmark
    bookmarkTypes.forEach(type => {
      bookmark[type] = bookmark[type].filter(id => id !== mangaId);
    })

    // Adding manga id to the bookmarks
    bookmark[type].push(mangaId);
    await bookmark.save();

    // Incrementing the number of the bookmarks
    manga.stats.bookmarks++;
    await manga.save();

    return bookmark.toObject();
  }

  @Mutation(() => String, {nullable: true})
  async deleteBookmark(@Arg("mangaId") mangaId: string, @Ctx() ctx: ApolloContext): Promise<string | null> {
    const bookmark: HydratedDocument<Bookmark> | null = await BookmarkModel.findOne({userId: ctx.user?.id});

    if (!bookmark) {
      throw new GraphQLError("Bookmark not found", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    const manga = await MangaModel.findOne({id: mangaId});

    if (!manga) {
      throw new GraphQLError("Manga not found", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    // Deleting manga id from bookmarks
    bookmarkTypes.forEach(type => {
      bookmark[type] = bookmark[type].filter(id => id !== mangaId);
    })
    await bookmark.save()

    // Decrementing manga's bookmarks
    manga.stats.bookmarks--;
    await manga.save();

    return bookmark.id;
  }

  @FieldResolver(() => [Manga])
  async inPlans(@Root() bookmark: Bookmark): Promise<Manga[]> {
    return MangaModel.find({id: {$in: bookmark.inPlans}}).lean();
  }

  @FieldResolver(() => [Manga])
  async reading(@Root() bookmark: Bookmark): Promise<Manga[]> {
    return MangaModel.find({id: {$in: bookmark.reading}}).lean();
  }

  @FieldResolver(() => [Manga])
  async finished(@Root() bookmark: Bookmark): Promise<Manga[]> {
    return MangaModel.find({id: {$in: bookmark.finished}}).lean();
  }

  @FieldResolver(() => [Manga])
  async dropped(@Root() bookmark: Bookmark): Promise<Manga[]> {
    return MangaModel.find({id: {$in: bookmark.dropped}}).lean();
  }

  @FieldResolver(() => [Manga])
  async favourite(@Root() bookmark: Bookmark): Promise<Manga[]> {
    return MangaModel.find({id: {$in: bookmark.favourite}}).lean();
  }

}