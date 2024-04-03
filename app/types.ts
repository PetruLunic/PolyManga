import z from "zod";
import {
  ChapterSchema,
  ImageSchema,
  MangaSchema,
  ComicsStatsSchema
} from "@/app/lib/zodSchemas";
import {Manga as TGManga} from "@/app/lib/graphql/schema"

import {Document} from "mongoose";

export type ComicsStats = z.infer<typeof ComicsStatsSchema>;

// Type for manga stats stored in DB
export interface MangaDBStats extends Omit<ComicsStats, "visitors"> {
  visitors: string[]
}

export type Manga = z.infer<typeof MangaSchema>;

// Type for manga stored in DB
export interface MangaDB extends Omit<TGManga, "stats"> {
  stats: MangaDBStats
}

export interface MangaCard extends Pick<Manga, "title" | "image" | "status" | "type"> {
  rating: number
  chapter: number
}

export type Chapter = z.infer<typeof ChapterSchema>;
export type Image = z.infer<typeof ImageSchema>;

export enum ComicsStatusBadgeColor {
  "ONGOING" = "primary",
  "FINISHED" = "success",
  "PAUSED" = "warning",
  "DROPPED" = "danger"
}

export enum ComicsTypeBadgeColor {
  "manhwa" = "danger",
  "manga" = "default",
  "manhua" = "secondary"
}

export enum ComicsType {
  manga = "manga",
  manhwa = "manhwa",
  manhua = "manhua"
}

export enum ComicsStatus {
  ONGOING = "ONGOING",
  FINISHED = "FINISHED",
  PAUSED = "PAUSED",
  DROPPED = "DROPPED"
}

export enum ChapterLanguage {
  en = "en",
  ru = "ru",
  ro = "ro"
}

export enum ChapterLanguageFull {
  en = "English",
  ru = "Russian",
  ro = "Romanian"
}

export enum ComicsGenre {
    action = 'action',
    fantasy = 'fantasy',
    drama = 'drama',
    harem = 'harem',
    martial_arts = 'martial_arts',
    apocalypse = 'apocalypse',
    cultivation = 'cultivation',
    game = 'game',
    hero = 'hero',
    mature = 'mature',
    comedy = 'comedy',
    genius_MC = 'genius_MC',
    historical = 'historical',
    loli = 'loli',
    mecha = 'mecha',
    adventure = 'adventure',
    isekai = 'isekai',
    magic = 'magic',
    romance = 'romance',
    noble = 'noble',
    time_travel = 'time_travel',
    murim = 'murim',
    rebirth = 'rebirth',
    school_life = 'school_life',
    system = 'system',
    tower = 'tower',
    virtual_reality = 'virtual_reality',
    regression = 'regression',
    sci_fi = 'sci_fi',
    thriller = 'thriller',
    tragedy = 'tragedy',
    villain = 'villain',
    necromancer = 'necromancer',
    post_apocalyptic = 'post_apocalyptic',
    reincarnation = 'reincarnation',
    revenge = 'revenge',
    sport = 'sport'
}