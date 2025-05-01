import {CoordsItem, UserPreferences} from "@/app/lib/graphql/schema";
import {locales} from "@/i18n/routing";

export interface UserSession {
  id: string,
  name: string,
  email: string,
  image: string,
  role: UserRole,
  userId?: string,
  preferences: UserPreferences
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

export enum ChapterLanguage  {
  En = "En",
  Ro = "Ro",
  Ru = "Ru",
  Fr = "Fr",
  Es = "Es",
  De = "De",
  It = "It",
  Th = "Th",
  Id = "Id",
  Vn = "Vn",
  Tl = "Tl",
  Pt = "Pt"
}

export type LocaleType = typeof locales[number];

export enum LocaleEnum {
  EN = "en",
  RU = "ru",
  RO = "ro",
  FR = "fr",
  ES = "es",
  DE = "de",
  IT = "it",
  TH = "th",
  ID = "id",
  VN = "vn",
  TL = "tl",
  PT = "pt"
}

export interface TextItem {
  text: string,
  fontSize?: number | null
}

export interface ContentItem {
  translatedTexts: Record<LocaleType, TextItem>,
  coords: Record<LocaleType, CoordsItem>;
}

export interface ChapterMetadata {
  chapterId: string; // Reference to Chapter.id
  content: ContentItem[];
}

export enum ChapterLanguageFull {
  En = "English",
  Ro = "Română",
  Ru = "Русский",
  Fr = "French",
  Es = "Español",
  De = "Deutsch",
  It = "Italiano",
  Th = "ไทย",
  Id = "Bahasa Indonesia",
  Vn = "Tiếng Việt",
  Tl = "Filipino",
  Pt = "Português"
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
    genius_mc = 'genius_MC',
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

export const bookmarkTypes = ["reading", "inPlans", "finished", "dropped", "favourite"] as const;
export type BookmarkType = typeof bookmarkTypes[number];

export const likeableObjects = ["Manga"] as const;
export type LikeableObject = typeof likeableObjects[number];