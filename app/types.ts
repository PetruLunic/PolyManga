import z from "zod";
import {
  ChapterSchema,
  ComicsGenreSchema,
  ComicsTypeSchema,
  ImageSchema,
  MangaSchema,
  MangaStatusSchema
} from "@/app/lib/zodSchemas";

export type MangaStatus = z.infer<typeof MangaStatusSchema>
export type ComicsType = z.infer<typeof ComicsTypeSchema>

export type Manga = z.infer<typeof MangaSchema>;

export type Chapter = z.infer<typeof ChapterSchema>;
export type Image = z.infer<typeof ImageSchema>;

export const MangaStatusBadgeColor = {
  "ONGOING": "primary",
  "FINISHED": "success",
  "PAUSED": "warning",
  "DROPPED": "danger"
} as const

export type ComicsGenre = z.infer<typeof ComicsGenreSchema>