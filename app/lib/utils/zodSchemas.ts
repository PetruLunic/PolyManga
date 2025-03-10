import z from "zod";
import {nanoid} from "nanoid";



export const PasswordSchema =  z.string()
        .min(8)
        .max(64)
        .refine((value) => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/.test(value),
          {params: {i18n: "passwordRegex"}})

export const ChangePasswordSchema = z.object({
  oldPassword: PasswordSchema,
  newPassword: PasswordSchema
})

export const UserSchema = z.object({
  name: z.string()
      .min(3)
      .max(50),
  email: z.string()
      .min(1)
      .max(100)
      .email(),
  password: PasswordSchema
});

export const UserSignInSchema = UserSchema.pick({email: true, password: true});

// Getting only the fields that can be modified from user schema
export const UserInfoSchema = UserSchema.pick({name: true});

export const UserPreferencesSchema = z.object({
  language: z.string(),
})

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

export const ComicsStatusSchema = z.enum(["ONGOING", "PAUSED", "FINISHED", "DROPPED"]);
export const ComicsTypeSchema = z.enum(["manhwa", "manga", "manhua"]);

const ComicsGenresArray = [
  "action", "fantasy", "drama", "harem", "martial_arts", "apocalypse", "cultivation", "game",
  "hero", "mature", "comedy", "genius_MC", "historical", "loli", "mecha", "adventure", "isekai",
  "magic", "romance", "noble", "return", "time_travel", "murim", "rebirth", "school_life", "system",
  "tower", "virtual_reality" ,"regression", "sci_fi", "thriller", "tragedy", "villain", "necromancer",
  "post_apocalyptic", "reincarnation", "revenge", "sport"
] as const

export const ComicsGenreSchema = z.enum(ComicsGenresArray);

export const RatingSchema = z.object({
  value: z.number().positive().max(10).default(0).optional(),
  nrVotes: z.number().int().positive().default(0).optional()
})

export const ComicsStatsSchema = z.object({
  rating: RatingSchema,
  likes: z.number().int().positive().optional().default(0),
  bookmarks: z.number().int().positive().optional().default(0),
  views: z.number().int().positive().optional().default(0)
})

export const MangaSchema = z.object({
  title: z.array(z.object({
      value: z.string().min(1).max(50),
      language: z.string()
  })),
  description: z.array(z.object({
    value: z.string().min(1).max(2000),
    language: z.string()
  })),
  status: ComicsStatusSchema,
  author: z.string().min(1).max(50),
  type: ComicsTypeSchema,
  genres: z.string(),
  releaseYear: z.number().positive().int()
})