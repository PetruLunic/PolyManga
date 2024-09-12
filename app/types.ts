import {useDisclosure} from "@nextui-org/react";
import {useState} from "react";
import {UserPreferences} from "@/app/lib/graphql/schema";

export interface UserSession {
  id: string,
  name: string,
  email: string,
  image: string,
  role: UserRole,
  userId?: string,
  preferences: UserPreferences
}

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
  En = "en",
  Ru = "ru",
  Ro = "ro",
  Fr = "fr"
}

export enum ChapterLanguageFull {
  En = "English",
  Ru = "Russian",
  Ro = "Romanian",
  Fr = "French"
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

export enum UserRole {
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  USER = "USER"
}

export enum UserProvider {
  GOOGLE = "GOOGLE",
  FACEBOOK = "FACEBOOK",
  CREDENTIALS = "CREDENTIALS"
}

export interface ModalProps extends ReturnType<typeof useDisclosure> {
  prop: ReturnType<typeof useState<string>>
}

export const bookmarkTypes = ["reading", "inPlans", "finished", "dropped", "favourite"] as const;
export type BookmarkType = typeof bookmarkTypes[number];

export const likeableObjects = ["Manga"] as const;
export type LikeableObject = typeof likeableObjects[number];

export type MangaCardType = "default" | "history" | "bookmark";