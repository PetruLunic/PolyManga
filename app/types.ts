import z from "zod";
import {ChapterSchema, ComicsTypeSchema, ImageSchema, MangaSchema, MangaStatusSchema} from "@/app/lib/zodSchemas";
import {Types} from "mongoose";

export type MangaStatus = z.infer<typeof MangaStatusSchema>
export type ComicsType = z.infer<typeof ComicsTypeSchema>

export interface Manga extends Omit<z.infer<typeof MangaSchema>, "chapters"> {
  chapters: Types.ObjectId[]
}

export type Chapter = z.infer<typeof ChapterSchema>;
export type Image = z.infer<typeof ImageSchema>;