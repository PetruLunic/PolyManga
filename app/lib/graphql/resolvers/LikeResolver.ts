import {Arg, Authorized, Ctx, ID, Mutation, Query, Resolver} from "type-graphql";
import {Like, LikeInput} from "@/app/lib/graphql/schema";
import LikeModel from "@/app/lib/models/Like";
import {type ApolloContext} from "@/app/api/graphql/route";
import {likeableObjects} from "@/app/types";
import {GraphQLError} from "graphql/error";
import mongoose, {HydratedDocument} from "mongoose";

@Resolver(() => Like)
export class LikeResolver {
  @Query(() => Boolean, {nullable: true})
  async isLiked(@Arg("objectId", () => ID) objectId: string, @Ctx() ctx: ApolloContext): Promise<boolean | null> {
    if (!ctx.user) return null;

    return LikeModel.findOne({objectId, userId: ctx.user?.id}).then(res => !!res);
  }

  @Authorized(["USER", "MODERATOR"])
  @Mutation(() => String, {nullable: true})
  async like(
      @Arg("input") {objectId, objectType}: LikeInput,
      @Ctx() ctx: ApolloContext
  ): Promise<string | undefined> {
    if (!likeableObjects.includes(objectType)) {
      throw new GraphQLError("You can not like this.", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    // If this object is already liked
    if (await LikeModel.findOne({objectId, userId: ctx.user?.id})) {
      throw new GraphQLError("You already liked this object.", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    const object: HydratedDocument<any> | null = await mongoose.models[objectType].findOne({id: objectId});

    if (!object) {
      throw new GraphQLError("This object does not exist.", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    if (object.isDeleted || object.isBanned) {
      throw new GraphQLError("This object is banned or deleted", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    switch(objectType) {
      case "Manga":
        object.stats.likes++;
        break;
    }

    const like = new LikeModel({
      userId: ctx.user?.id,
      objectId,
      objectType
    })

    await like.save();
    await object.save();

    return like.id;
  }

  @Authorized(["USER", "MODERATOR"])
  @Mutation(() => String, {nullable: true})
  async unlike(@Arg("objectId") objectId: string, @Ctx() ctx: ApolloContext): Promise<string | undefined> {
    const like: Like | null = await LikeModel.findOneAndDelete({objectId, userId: ctx.user?.id}).lean();

    if (!like) {
      throw new GraphQLError("This object was not liked by you.", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    const object = await mongoose.models[like.objectType].findOne({id: objectId});

    switch (like.objectType) {
      case "Manga":
        object.stats.likes--;
        break;
    }

    await object.save();

    return like.id;
  }
}