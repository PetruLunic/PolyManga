import {Arg, Authorized, Ctx, Float, ID, Int, Mutation, Query, Resolver} from "type-graphql";
import {Rating, RatingInput} from "@/app/lib/graphql/schema";
import MangaModel from "@/app/lib/models/Manga";
import RatingModel from "@/app/lib/models/Rating";
import {GraphQLError} from "graphql/error";
import {type ApolloContext} from "@/app/api/graphql/route";

@Resolver(() => Rating)
export class RatingResolver {
  @Authorized(["USER", "MODERATOR"])
  @Mutation(() => Float, {nullable: true})
  async addRating(@Arg("input") {slug, value}: RatingInput, @Ctx() ctx: ApolloContext): Promise<number | undefined> {
    if (value > 10 || value < 1) {
      throw new GraphQLError("Rating must be between 1 and 10", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    if (!Number.isInteger(value)) {
      throw new GraphQLError("Rating value must be an integer", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    const manga = await MangaModel.findOne({slug});

    if (!manga) {
      throw new GraphQLError("Manga not found", {
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

    const rating = await RatingModel.findOne({mangaId: manga.id, userId: ctx.user?.id});

    const {value: mangaRating, nrVotes} = manga.stats.rating;

    // Mutating existing rating object or creating new one
    if (rating) {
      // If value of rating is not the same as it was
      if (value !== rating.value) {
        // Removing old value from manga rating
        const oldRating = nrVotes > 1
            ? (mangaRating * nrVotes - rating.value) / (nrVotes - 1)
            : 0;

        // Setting new value
        manga.stats.rating.value = nrVotes > 1
            ? (oldRating * (nrVotes - 1) + value) / nrVotes
            : value;

        await manga.save();

        rating.value = value;
        await rating.save();

        return manga.stats.rating.value;
      }
    } else {
      // Creating new Rating document
      const newRating = new RatingModel({
        mangaId: manga.id,
        userId: ctx.user?.id,
        value
      });
      await newRating.save();

      // Mutating value and nrVotes of manga rating
      manga.stats.rating.value = (mangaRating * nrVotes + value) / (nrVotes + 1);
      manga.stats.rating.nrVotes++;

      await manga.save();

      return manga.stats.rating.value;
    }
  }

  @Authorized(["USER", "MODERATOR"])
  @Mutation(() => String, {nullable: true})
  async deleteRating(@Arg("slug") slug: string, @Ctx() ctx: ApolloContext): Promise<string | undefined> {
    const manga = await MangaModel.findOne({slug});

    if (!manga) {
      throw new GraphQLError("Manga not found", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    const rating = await RatingModel.findOneAndDelete({mangaId: manga.id, userId: ctx.user?.id}).lean();

    if (!rating) {
      throw new GraphQLError("This rating does not exist", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    const {value: mangaRating, nrVotes} = manga.stats.rating;

    // If it's the last rating, set manga rating to 0
    if (nrVotes === 1) {
      manga.stats.rating.value = 0;
      manga.stats.rating.nrVotes = 0;
    } else {
      // Setting new value without old rating
      manga.stats.rating.value = (mangaRating * nrVotes - rating.value) / (nrVotes - 1);
      manga.stats.rating.nrVotes--;
    }

    await manga.save();

    return rating?.id;
  }

  // @Authorized(["USER", "MODERATOR"])
  @Query(() => Int, {nullable: true})
  async isRated(@Arg("slug", () => ID) slug: string, @Ctx() ctx: ApolloContext): Promise<number | null | undefined> {
    if (!ctx.user) return null;
    const manga = await MangaModel.findOne({slug}).lean();

    if (!manga) {
      throw new GraphQLError("Manga not found", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    return RatingModel
        .findOne({mangaId: manga.id, userId: ctx.user?.id})
        .lean()
        .then(res => res?.value);
  }
}