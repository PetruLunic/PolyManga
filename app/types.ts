import z from "zod";
import {
  ChapterSchema,
  ComicsGenreSchema,
  ComicsTypeSchema,
  ImageSchema,
  MangaSchema,
  MangaStatusSchema, StatsSchema
} from "@/app/lib/zodSchemas";

export type MangaStatus = z.infer<typeof MangaStatusSchema>;
export type ComicsType = z.infer<typeof ComicsTypeSchema>;
export type MangaStats = z.infer<typeof StatsSchema>;

// Type for manga stats stored in DB
export interface MangaDBStats extends Omit<MangaStats, "visitors"> {
  visitors: string[]
}

export type Manga = z.infer<typeof MangaSchema>;

// Type for manga stored in DB
export interface MangaDB extends Omit<Manga, "stats"> {
  stats: MangaDBStats
}

export interface MangaCard extends Pick<Manga, "title" | "image" | "status" | "type"> {
  rating: number
  chapter: number
}

export type Chapter = z.infer<typeof ChapterSchema>;
export type Image = z.infer<typeof ImageSchema>;

export const MangaStatusBadgeColor = {
  "ONGOING": "primary",
  "FINISHED": "success",
  "PAUSED": "warning",
  "DROPPED": "danger"
} as const

export type ComicsGenre = z.infer<typeof ComicsGenreSchema>