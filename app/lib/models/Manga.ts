import mongoose, {Model, model, Query, Schema} from "mongoose";
import {Manga as TGManga} from "@/app/lib/graphql/schema";
import {MangaDB, ComicsStatus, ComicsType} from "@/app/types";
import {ComicsGenreSchema} from "@/app/lib/utils/zodSchemas";
import {nanoid} from "nanoid";
import Chapter from "@/app/lib/models/Chapter";

interface MangaModel extends Model<MangaDB> {}

const MangaSchema = new Schema<MangaDB>({
  id: {
    type: String,
    default: () => nanoid(),
    unique: true
  },
  title: {
    type: String,
    required: [true, "Manga must have a title"],
    maxlength: [50, "Title cannot be more than 50 characters"],
    unique: true
  },
  author: {
    type: String,
    required: [true, "Manga must have an author"],
    maxlength: [50, "Author name cannot be more than 40 characters"],
  },
  description: {
    type: String,
    required: [true, "Manga must have a description"],
    maxlength: [2000, "Description cannot be more than 1000 characters"],
  },
  status: {
    type: String,
    enum: ComicsStatus,
    default: ComicsStatus.ONGOING
  },
  type: {
    type: String,
    enum: ComicsType,
    required: [true, "Manga must have a type"]
  },
  chapters: [{
    type: String,
    ref: 'Chapter'
  }],
  image: {
    type: String,
    required: [true, "Manga must have an image"]
  },
  stats: {
    rating: {
      value: {
        type: Number,
        default: 0,
      },
      nrVotes: {
        type: Number,
        default: 0
      }
    },
    likes: {
      type: Number,
      default: 0
    },
    bookmarks: {
      type: Number,
      default: 0
    },
    visitors: {
      type: [String],
      default: []
    }
  },
  genres: {
    type: [String],
    enum: ComicsGenreSchema.Enum,
    default: []
  },
  releaseYear: {
    type: Number,
    required: [true, "Manga must have a release year"]
  },
  postedOn: {
    type: String,
    default: () => new Date().toDateString()
  }
},
    {
      toJSON: {
        virtuals: true
      },
      timestamps: true
    })


export function toClient(manga: MangaDB): TGManga {
  return {
    ...manga,
    stats: {
      ...manga.stats,
      visitors: manga.stats.visitors.length
    }
  } as TGManga
}

export function toClientMany(mangas: MangaDB[]): TGManga[] {
  const newMangas: TGManga[] = [];

  mangas.forEach(manga => {
    newMangas.push({
      ...manga,
      stats: {
        ...manga.stats,
        visitors: manga.stats.visitors.length
      }
    } as TGManga)
  })

  return newMangas;
}

export default mongoose.models["Manga"] as MangaModel || model<MangaDB, MangaModel>("Manga", MangaSchema);