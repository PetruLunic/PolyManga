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
  title: z.string().min(1).max(50),
  images: z.array(ImageSchema)
})

export const MangaStatusSchema = z.enum(["ONGOING", "PAUSED", "FINISHED"]);
export const ComicsTypeSchema = z.enum(["manhwa", "manga", "manhua"]);

export const RatingSchema = z.object({
  value: z.number().positive().max(10).default(0).optional(),
  nrVotes: z.number().int().positive().default(0).optional()
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
  rating: RatingSchema.optional()
})