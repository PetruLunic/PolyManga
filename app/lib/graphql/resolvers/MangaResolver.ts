import {Arg, Args, Authorized, Ctx, FieldResolver, ID, Int, Mutation, Query, Resolver, Root} from "type-graphql";
import {
  AddMangaInput,
  Chapter,
  ComicsRating,
  ComicsStats,
  EditMangaInput,
  GetMangasArgs,
  Manga
} from "@/app/lib/graphql/schema";
import MangaModel from "@/app/lib/models/Manga";
import {GraphQLError} from "graphql/error";
import ChapterModel from "@/app/lib/models/Chapter";
import {type ApolloContext} from "@/app/api/graphql/route";
import {HydratedDocument, PipelineStage} from "mongoose";
import {cookies} from "next/headers";
import ChapterBookmarkModel from "@/app/lib/models/ChapterBookmark";

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
  async mangas(@Args() {search, types, statuses, genres, sort, languages, sortBy}: GetMangasArgs): Promise<Manga[] | []> {
    const query: any = {
      isDeleted: false,
      isBanned: false,
    };

    const sortOrderValue = sort === 'asc' ? 1 : -1;
    let sortField = 'stats.views';
    let sortStage = {} as PipelineStage;

    switch (sortBy) {
      case 'rating':
        sortField = 'stats.rating.value';
        break;
      case 'views':
      case 'likes':
      case 'bookmarks':
        sortField = `stats.${sortBy}`;
        break;
      case 'createdAt':
      case 'language':
        sortField = sortBy;
        break;
      case 'chapters':
        // Handle sorting by the length of the chapters array
        sortStage = { $sort: { chaptersLength: sortOrderValue } };
        break;
      default:
        sortField = 'stats.views';
    }

    if (!sortStage.hasOwnProperty('$sort')) {
      sortStage = { $sort: { [sortField]: sortOrderValue } };
    }

    if (search) {
      query.title = { $regex: new RegExp(search, 'i') }; // Case-insensitive partial match
    }

    if (types && types.length > 0) {
      query.type = { $in: types };
    }

    if (languages && languages.length > 0) {
      query.languages = { $all: languages };
    }

    if (statuses && statuses.length > 0) {
      query.status = { $in: statuses };
    }

    if (genres && genres.length > 0) {
      query.genres = { $all: genres };
    }

    // Define the aggregation pipeline
    const aggregationPipeline = [
      { $match: query },
      {
        $addFields: {
          chaptersLength: { $size: '$chapters' }
        }
      },
      sortStage
    ] satisfies PipelineStage[]

    return MangaModel.aggregate(aggregationPipeline).exec();
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

  @FieldResolver(() => Chapter, {nullable: true})
  async bookmarkedChapter(@Root() manga: Manga, @Ctx() {user}: ApolloContext): Promise<Chapter | null> {
    if (!user) return null;

    const bookmark = await ChapterBookmarkModel.findOne({userId: user?.id, mangaId: manga.id}).lean();

    if (!bookmark) return null;

    return ChapterModel.findOne({id: bookmark.chapterId}).lean();
  }
}