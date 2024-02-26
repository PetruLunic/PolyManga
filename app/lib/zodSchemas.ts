import z from "zod";

export const ObjectIdSchema = z.string().length(24, "Id length should be 24");

export const ImageSchema = z.object({
  src: z.string().min(1).max(100),
  width: z.number().positive(),
  height: z.number().positive()
})

export const ChapterSchema = z.object({
  title: z.string().min(1).max(50),
  images: z.array(ImageSchema)
})

export const MangaStatusSchema = z.enum(["ONGOING", "PAUSED", "FINISHED"]);
export const ComicsTypeSchema = z.enum(["manhwa", "manga", "manhua"]);

export const MangaSchema = z.object({
  title: z.string().min(1).max(50),
  description: z.string().min(1).max(2000),
  status: MangaStatusSchema,
  author: z.string().min(1).max(50),
  chapters: z.array(ObjectIdSchema),
  type: ComicsTypeSchema,
  image: z.string().min(1).max(100),
  rating: z.number().positive().max(10).default(0).optional()
})

