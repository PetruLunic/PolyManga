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
import {LogExecutionTime} from "@/app/lib/utils/decorators";
import {DEFAULT_LANGUAGE} from "@/app/lib/utils/constants";

@Resolver(() => ComicsStats)
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
  @LogExecutionTime()
  @Query(() => Manga, {nullable: true})
  async manga(@Arg('id') id: string): Promise<Manga | null> {
    const manga: Manga | null = await MangaModel.findOne({slug: id}).lean();

    if (!manga) {
      throw new GraphQLError("Manga not found", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    if (manga.isDeleted || manga.isBanned) {
      throw new GraphQLError("Manga access restricted", { extensions: { code: "FORBIDDEN" } });
    }

    return manga;
  }

  @LogExecutionTime()
  @Query(() => [Manga])
  async mangas(@Args() {
    search, types, statuses, genres, sort, languages, sortBy, limit = 30, offset = 0
  }: GetMangasArgs): Promise<Manga[] | []> {
    try {
      const matchQuery: any = { isDeleted: false, isBanned: false };

      // --- Filtering ---
      if (search) {
        // Regex can be slow. Consider MongoDB Atlas Search for performance.
        // Ensure 'title.value' is indexed if using regex heavily.
        // Using a text index might be better if available/suitable.
        matchQuery["titles.value"] = { $regex: new RegExp(search, 'i') };
      }
      if (types && types.length > 0) matchQuery.type = { $in: types };
      if (languages && languages.length > 0) matchQuery.languages = { $all: languages }; // Ensure index on languages array
      if (statuses && statuses.length > 0) matchQuery.status = { $in: statuses };
      if (genres && genres.length > 0) matchQuery.genres = { $all: genres }; // Ensure index on genres array

      // --- Sorting ---
      const sortOrderValue = sort === 'asc' ? 1 : -1;
      let sortDefinition: any = {};
      let needsChapterCount = false;

      switch (sortBy) {
        case 'rating': sortDefinition = { 'stats.rating.value': sortOrderValue }; break;
        case 'views':
        case 'dailyViews':
        case 'weeklyViews':
        case 'monthlyViews':
        case 'likes':
        case 'bookmarks': sortDefinition = { [`stats.${sortBy}`]: sortOrderValue }; break;
        case 'createdAt': sortDefinition = { createdAt: sortOrderValue }; break;
        case 'language': sortDefinition = { language: sortOrderValue }; break; // Assuming 'language' is a top-level field
        case 'chapters':
          needsChapterCount = true; // Flag that we need the count
          sortDefinition = { chaptersLength: sortOrderValue }; // Sort by calculated field
          break;
        default: sortDefinition = { 'stats.views': sortOrderValue };
      }
      sortDefinition._id = 1; // Add secondary sort by _id for stable pagination

      // --- Aggregation Pipeline ---
      const aggregationPipeline: PipelineStage[] = [{ $match: matchQuery }];

      // Conditionally add chapter count calculation ONLY if sorting by it
      if (needsChapterCount) {
        // OPTION 1 (Current): Calculate on the fly (can be slow)
        aggregationPipeline.push({ $addFields: { chaptersLength: { $size: '$chapters' } } });
        // OPTION 2 (Recommended): Maintain a 'chaptersCount' field on MangaModel,
        // update it on chapter add/delete, and sort directly:
        // sortDefinition = { chaptersCount: sortOrderValue, _id: 1 };
        // Remove the $addFields stage if using Option 2.
      }

      // Add sort, skip, limit
      aggregationPipeline.push({ $sort: sortDefinition });
      aggregationPipeline.push({ $skip: offset });
      aggregationPipeline.push({ $limit: limit });

      // OPTIONAL: Add a $project stage *before* $skip/$limit if documents are large
      // and you know only specific fields will be requested by GraphQL downstream.
      // aggregationPipeline.push({ $project: { title: 1, slug: 1, coverImage: 1, /* etc. */ } });

      // Ensure necessary indexes exist for $match fields and $sort fields!
      // e.g., { status: 1, "stats.views": -1 }, { type: 1, "stats.rating.value": -1 }, etc.
      // Text index for `title.value` if using $regex search heavily.
      // Index on `chaptersCount` if using Option 2 for sorting by chapters.
      return MangaModel.aggregate(aggregationPipeline).exec();

    } catch (e) {
      console.error("[mangas resolver error]: ", e);
      throw new GraphQLError("Failed to fetch mangas", { extensions: { code: "INTERNAL_SERVER_ERROR" } });
    }
  }

  // @LogExecutionTime()
  // @Query(() => [Manga])
  // async mangas(@Args() {
  //   search,
  //   types,
  //   statuses,
  //   genres,
  //   sort,
  //   languages,
  //   sortBy,
  //   limit = 30,
  //   offset = 0
  // }: GetMangasArgs):
  //   Promise<Manga[] | []>
  // {
  //   try {
  //     const query: any = {
  //       isDeleted: false,
  //       isBanned: false,
  //     };
  //
  //     const sortOrderValue = sort === 'asc' ? 1 : -1;
  //     let sortField = 'stats.views';
  //     let sortStage = {} as PipelineStage;
  //
  //     switch (sortBy) {
  //       case 'rating':
  //         sortField = 'stats.rating.value';
  //         break;
  //       case 'views':
  //       case 'dailyViews':
  //       case 'weeklyViews':
  //       case 'monthlyViews':
  //       case 'likes':
  //       case 'bookmarks':
  //         sortField = `stats.${sortBy}`;
  //         break;
  //       case 'createdAt':
  //       case 'language':
  //         sortField = sortBy;
  //         break;
  //       case 'chapters':
  //         // Handle sorting by the length of the chapters array
  //         sortStage = { $sort: { chaptersLength: sortOrderValue, id: 1 } };
  //         break;
  //       default:
  //         sortField = 'stats.views';
  //     }
  //
  //     if (!sortStage.hasOwnProperty('$sort')) {
  //       sortStage = { $sort: { [sortField]: sortOrderValue, id: 1 } };
  //     }
  //
  //     if (search) {
  //       query["title.value"] = { $regex: new RegExp(search, 'i') }; // Case-insensitive partial match
  //     }
  //
  //     if (types && types.length > 0) {
  //       query.type = { $in: types };
  //     }
  //
  //     if (languages && languages.length > 0) {
  //       query.languages = { $all: languages };
  //     }
  //
  //     if (statuses && statuses.length > 0) {
  //       query.status = { $in: statuses };
  //     }
  //
  //     if (genres && genres.length > 0) {
  //       query.genres = { $all: genres };
  //     }
  //
  //     // Define the aggregation pipeline
  //     const aggregationPipeline = [
  //       { $match: query },
  //       {
  //         $addFields: {
  //           chaptersLength: { $size: '$chapters' }
  //         }
  //       },
  //       sortStage,
  //       { $skip: offset }, // Skip documents for pagination
  //       { $limit: limit }, // Limit the number of documents returned
  //     ] satisfies PipelineStage[]
  //
  //     return MangaModel.aggregate(aggregationPipeline).exec();
  //   } catch (e) {
  //     console.error("[mangas resolver error]: ", e);
  //     throw e;
  //   }
  // }

  @Authorized(["MODERATOR"])
  @Mutation(() => Manga)
  async addManga(@Arg("manga") mangaInput: AddMangaInput) {
    try {
      const manga = new MangaModel(mangaInput);
      await manga.save();
      return manga.toObject();
    } catch (error) {
      if (error && typeof error === "object" && 'code' in error && error.code === 11000) { // MongoDB duplicate key error code
        throw new GraphQLError("Title for this language already exists", {
          extensions: {
            code: "BAD_USER_INPUT"
          }
        });
      }
      throw error;
    }
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
      (await cookies()).set(id, "1", {expires: Date.now() + EXPIRE_TIME});

      // Increment views for comics
      const manga = await MangaModel.findOneAndUpdate(
          {
            slug: id,
            isDeleted: false,
            isBanned: false
          }, {
            $inc: {
              "stats.views": 1,
              "stats.dailyViews": 1,
              "stats.weeklyViews": 1,
              "stats.monthlyViews": 1
            }
          }, {new: true})
          .lean();
      return manga?.stats.views;
    }
  }

  @LogExecutionTime()
  @FieldResolver(() => [Chapter])
  async chapters(
    @Root() manga: Manga,
    @Arg("limit", () => Int, { defaultValue: 30, description: "Limit number of chapters returned" }) limit: number,
    @Arg("offset", () => Int, { defaultValue: 0, description: "Offset for chapter pagination" }) offset: number,
    @Arg("isDescending", () => Boolean, {defaultValue: true}) isDescending: boolean,
    ): Promise<Chapter[]> {
    return ChapterModel.find({ mangaId: manga.id })
      .sort({ number: isDescending ? "descending" : "ascending" })
      .skip(offset)
      .limit(limit)
      .lean();
  }

  @FieldResolver(() => String)
  title(
    @Root() manga: Manga,
    @Arg("locale", () => String, {defaultValue: DEFAULT_LANGUAGE}) locale: string
  ): string {
    return manga.titles.find(({language}) => locale === language.toLowerCase())?.value
      ?? manga.titles[0].value;
  }

  @FieldResolver(() => String)
  description(
    @Root() manga: Manga,
    @Arg("locale", () => String, {defaultValue: DEFAULT_LANGUAGE}) locale: string
  ): string {
    return manga.descriptions.find(({language}) => locale === language.toLowerCase())?.value
      ?? manga.descriptions[0].value;
  }

  @FieldResolver(() => Chapter, {nullable: true})
  async latestChapter(@Root() manga: Manga): Promise<Chapter | null> {
    return ChapterModel.findOne({ mangaId: manga.id })
      .sort({ number: -1 })
      .limit(1)
      .lean();
  }

  @FieldResolver(() => Chapter, {nullable: true})
  async firstChapter(@Root() manga: Manga): Promise<Chapter | null> {
    return ChapterModel.findOne({ mangaId: manga.id })
      .sort({ number: 1 })
      .limit(1)
      .lean();
  }

  @FieldResolver(() => Chapter, {nullable: true})
  async bookmarkedChapter(@Root() manga: Manga, @Ctx() {user}: ApolloContext): Promise<Chapter | null> {
    if (!user) return null;

    const bookmark = await ChapterBookmarkModel.findOne({userId: user?.id, mangaId: manga.id}).lean();

    if (!bookmark) return null;

    return ChapterModel.findOne({id: bookmark.chapterId}).lean();
  }
}