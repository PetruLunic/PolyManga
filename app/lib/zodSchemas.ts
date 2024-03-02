import z from "zod";
import {nanoid} from "nanoid";

export const IDSchema = z.string().length(nanoid().length);

export const ImageSchema = z.object({
  src: z.string().min(1).max(100),
  width: z.number().positive(),
  height: z.number().positive()
})

export const ChapterSchema = z.object({
  id: IDSchema.optional(),
  number: z.number().int().min(0).positive(),
  title: z.string().min(1).max(50),
  images: z.array(ImageSchema)
}).readonly();

export const MangaStatusSchema = z.enum(["ONGOING", "PAUSED", "FINISHED", "DROPPED"]);
export const ComicsTypeSchema = z.enum(["manhwa", "manga", "manhua"]);

export const ComicsGenreSchema = z.enum([
    "action", "fantasy", "drama", "harem", "martial arts", "apocalypse", "cultivation", "game",
  "hero", "mature", "comedy", "genius MC", "historical", "loli", "mecha", "adventure", "isekai",
  "magic", "romance", "noble", "return", "time travel", "murim", "rebirth", "school life", "system",
  "tower", "virtual reality" ,"regression", "sci-fi", "thriller", "tragedy", "villain", "necromancer",
  "post-apocalyptic", "reincarnation", "revenge", "sport"]);

export const RatingSchema = z.object({
  value: z.number().positive().max(10).default(0).optional(),
  nrVotes: z.number().int().positive().default(0).optional()
})

export const StatsSchema = z.object({
  rating: RatingSchema,
  likes: z.number().int().positive().optional().default(0),
  bookmarks: z.number().int().positive().optional().default(0),
  visitors: z.number().int().positive().optional().default(0)
})

export const MangaSchema = z.object({
  id: IDSchema.optional(),
  title: z.string().min(1).max(50),
  description: z.string().min(1).max(2000),
  status: MangaStatusSchema,
  author: z.string().min(1).max(50),
  chapters: z.array(IDSchema),
  type: ComicsTypeSchema,
  image: z.string().min(1).max(100),
  stats: StatsSchema,
  genre: z.array(ComicsGenreSchema),
  releaseYear: z.number().positive().int(),
  postedOn: z.date().optional()
}).readonly();