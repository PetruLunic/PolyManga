import {Arg, Authorized, Ctx, FieldResolver, ID, Int, Mutation, Query, Resolver, Root} from "type-graphql";
import {AddMangaInput, Chapter, ComicsRating, ComicsStats, EditMangaInput, Manga} from "@/app/lib/graphql/schema";
import MangaModel from "@/app/lib/models/Manga";
import {GraphQLError} from "graphql/error";
import ChapterModel from "@/app/lib/models/Chapter";
import {type ApolloContext} from "@/app/api/graphql/route";
import s3 from "@/app/lib/utils/S3Client";
import {DeleteObjectCommand} from "@aws-sdk/client-s3";
import {HydratedDocument} from "mongoose";
import {cookies} from "next/headers";

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
    const manga: Manga | null = await MangaModel.findOne({id}).lean();

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

    return manga;
  }

  @Query(() => [Manga])
  async mangas(): Promise<Manga[] | []> {
    const mangas = await MangaModel.find({isDeleted: false, isBanned: false}).lean();

    return mangas;
  }

  @Authorized(["MODERATOR"])
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

  @Authorized(["MODERATOR"])
  @Mutation(() => Manga)
  async editManga(@Arg("manga") mangaInput: EditMangaInput) {
    return MangaModel.findOneAndUpdate({id: mangaInput.id}, mangaInput);
  }

  @Authorized(["MODERATOR"])
  @Mutation(() => ID)
  async deleteManga(@Arg("id") id: string): Promise<string> {
    // Mark the manga as deleted
    const manga: HydratedDocument<Manga> | null = await MangaModel.findOne({id});

    if (!manga) {
      throw new GraphQLError("Manga not found", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    if (manga.isDeleted) {
      throw new GraphQLError("This manga is already deleted", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    manga.isDeleted = true;
    await manga.save();

    // Fetch all chapters for the manga
    const chapters = await ChapterModel.find({ mangaId: id }).lean();

    const bucketName = process.env.AWS_BUCKET_NAME;

    if (!bucketName) {
      throw new GraphQLError("Aws bucket name (AWS_BUCKET_NAME) not provided in .env file.", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR"
        }
      })
    }

    const bucketUrl = process.env.AWS_BUCKET_URL;

    if (!bucketUrl) {
      throw new GraphQLError("Aws bucket url (AWS_BUCKET_URL) not provided in .env file.", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR"
        }
      })
    }

    let promisesBatch: any[] = [];

    // Delete images from S3
    for (const chapter of chapters) {
      for (const version of chapter.versions) {
        for (const image of version.images) {
          const command = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: image.src.replace(`${bucketUrl}`, ''),
          });

          // Pushing promise in the batch
          promisesBatch.push(s3.send(command));

          // If promises length reach 50 units, then wait, resolve them, and starting next batch;
          if (promisesBatch.length > 50) {
            await Promise.all(promisesBatch);
            promisesBatch = [];
          }
        }
      }
    }

    // Delete chapters from database
    await ChapterModel.deleteMany({ mangaId: id });

    return id;
  }

  @Mutation(() => Int, {nullable: true})
  async incrementViews(@Arg("id") id: string, @Ctx() {req}: ApolloContext): Promise<number | undefined> {
    const expireDate = req.cookies.get(id)?.value;

    const EXPIRE_TIME = 10 * 24 * 60 * 60 * 1000; // 10 days

    // If browser never visited, or visited a long ago this comics
    if (!expireDate) {
      cookies().set(id, "1", {expires: Date.now() + EXPIRE_TIME});

      // Increment views for comics
      const manga = await MangaModel.findOneAndUpdate({id, isDeleted: false, isBanned: false}, { $inc: {"stats.views": 1} }, {new: true}).lean();
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