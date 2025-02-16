import {Arg, Authorized, Ctx, ID, Mutation, Query, Resolver} from "type-graphql";
import {Like} from "@/app/lib/graphql/schema";
import LikeModel from "@/app/lib/models/Like";
import {type ApolloContext} from "@/app/api/graphql/route";
import {GraphQLError} from "graphql/error";
import MangaModel from "@/app/lib/models/Manga";

@Resolver(() => Like)
export class LikeResolver {
  @Query(() => Boolean, {nullable: true})
  async isLiked(@Arg("slug", () => ID) slug: string, @Ctx() ctx: ApolloContext): Promise<boolean | null> {
    if (!ctx.user) return null;

    const manga = await MangaModel.findOne({slug}).lean();

    if (!manga) {
      throw new GraphQLError("This manga does not exist.", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    return LikeModel.findOne({mangaId: manga.id, userId: ctx.user?.id}).then(res => !!res);
  }

  @Authorized(["USER", "MODERATOR"])
  @Mutation(() => String, {nullable: true})
  async like(
      @Arg("slug", () => ID) slug: string,
      @Ctx() ctx: ApolloContext
  ): Promise<string | undefined> {
    const manga = await MangaModel.findOne({slug});

    if (!manga) {
      throw new GraphQLError("This manga does not exist.", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    if (manga.isDeleted || manga.isBanned) {
      throw new GraphQLError("This manga is banned or deleted", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    // If this object is already liked
    if (await LikeModel.findOne({mangaId: manga.id, userId: ctx.user?.id})) {
      throw new GraphQLError("You already liked this object.", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    manga.stats.likes += 1;

    const like = new LikeModel({
      userId: ctx.user?.id,
      mangaId: manga?.id,
    })

    await Promise.all([
      like.save(),
      manga.save()
    ])

    return like.id;
  }

  @Authorized(["USER", "MODERATOR"])
  @Mutation(() => String, {nullable: true})
  async unlike(@Arg("slug", () => ID) slug: string, @Ctx() ctx: ApolloContext): Promise<string | undefined> {
    const manga = await MangaModel.findOne({slug});

    if (!manga) {
      throw new GraphQLError("This manga does not exist.", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    if (manga.isDeleted || manga.isBanned) {
      throw new GraphQLError("This manga is banned or deleted", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    const like: Like | null = await LikeModel.findOneAndDelete({mangaId: manga.id, userId: ctx.user?.id}).lean();

    if (!like) {
      throw new GraphQLError("This object was not liked by you.", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    manga.stats.likes--;
    await manga.save();

    return like.id;
  }
}