import {Arg, Ctx, FieldResolver, ID, Int, Mutation, Query, Resolver, Root} from "type-graphql";
import {AddMangaInput, Chapter, ComicsRating, ComicsStats, Manga} from "@/app/lib/graphql/schema";
import MangaModel from "@/app/lib/models/Manga";
import {GraphQLError} from "graphql/error";
import ChapterModel from "@/app/lib/models/Chapter";
import {type ApolloContext} from "@/app/api/graphql/route";
import bcrypt from "bcryptjs";
import redis from "@/app/lib/utils/redis";
import crypto from "crypto";

@Resolver(of => ComicsStats)
export class ComicsStatsResolver {
  // Value of rating to 2 fraction digits
  @FieldResolver(() => ComicsRating)
  rating(@Root() stats: ComicsStats): ComicsRating {
    return {
      value: Number.parseFloat(stats.rating.value.toFixed(2)),
      nrVotes: stats.rating.nrVotes
    }
  }
}

@Resolver(() => Manga)
export class MangaResolver {
  @Query(() => Manga, {nullable: true})
  async manga(@Arg('id', () => ID) id: string): Promise<Manga | null> {
    const manga = await MangaModel.findOne({id}).lean();

    if (!manga) {
      throw new GraphQLError("Manga not found", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    return manga;
  }

  @Query(() => [Manga])
  async mangas(): Promise<Manga[] | []> {
    const mangas = await MangaModel.find().lean();

    return mangas;
  }

  @Mutation(() => Manga)
  async addManga(@Arg("manga") mangaInput: AddMangaInput) {
    // If exists manga with the same title
    if (await MangaModel.findOne({title: mangaInput.title})) {
      throw new GraphQLError("Title for manga must be unique", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    const manga = new MangaModel(mangaInput);
    await manga.save();

    return manga.toObject();
  }

  @Mutation(() => ID)
  async deleteManga(@Arg("id") id: string): Promise<string> {
    const manga = await MangaModel.findOneAndDelete({id}).lean();

    // Deleting the manga's chapters
    await ChapterModel.deleteMany({mangaId: manga?.id});

    return id;
  }

  @Mutation(() => Int, {nullable: true})
  async incrementViews(@Arg("id") id: string, @Ctx() {req}: ApolloContext): Promise<number | undefined> {
    const ip = req.ip || req.headers.get('X-Forwarded-For');
    if (!ip) return;

    const hashedIp = crypto.createHash('sha256').update(ip).digest('hex');
    const cacheKey = `manga:${id}:ip:${hashedIp}`;
    const cachedIp = await redis.get(cacheKey);

    if (!cachedIp) {
      // IP not in cache, increment view count
      const manga = await MangaModel.findOneAndUpdate({id}, { $inc: {"stats.views": 1} }, {new: true}).lean();
      // Add IP to cache with for 10 days
      await redis.set(cacheKey, '1', "EX", 10 * 24 * 60 * 60);

      return manga?.stats.views;
    }
  }

  @FieldResolver(() => [Chapter])
  async chapters(@Root() manga: Manga): Promise<Chapter[]> {
    // Return manga's chapters sorted ascending by chapter's number
    const chapters: Chapter[] = await ChapterModel.find({mangaId: manga.id}).lean();

    return chapters.sort((c1, c2) => c1.number - c2.number)
  }

  @FieldResolver(() => Chapter, {nullable: true})
  async latestChapter(@Root() manga: Manga): Promise<Chapter | null> {
    const chapters: Chapter[] = await ChapterModel.find({mangaId: manga.id}).lean();

    if (chapters.length === 0) return null;

    return chapters.reduce((acc: Chapter, ch) => acc.number > ch.number ? acc : ch, chapters[0])
  }

  @FieldResolver(() => Chapter, {nullable: true})
  async firstChapter(@Root() manga: Manga): Promise<Chapter | null> {
    const chapters: Chapter[] = await ChapterModel.find({mangaId: manga.id}).lean();

    if (chapters.length === 0) return null;

    return chapters.reduce((acc: Chapter, ch) => acc.number < ch.number ? acc : ch, chapters[0])
  }
}