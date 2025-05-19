import mongoose, {Model, model, Schema} from "mongoose";
import {ComicsStatus, ComicsType} from "@/app/types";
import {ComicsGenreSchema} from "@/app/lib/utils/zodSchemas";
import {nanoid} from "nanoid";
import {Manga} from "@/app/lib/graphql/schema";
import {ChapterLanguage} from "@/app/__generated__/graphql";

interface MangaModel extends Model<Manga> {}

const MangaSchema = new Schema<Manga>({
  id: {
    type: String,
    default: () => nanoid(),
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true // for faster lookups
  },
  titles: [{
    language: {
      type: String,
      required: true,
      enum: ChapterLanguage
    },
    value: {
      type: String,
      required: true,
      maxlength: [200, "Title cannot be more than 50 characters"]
    }
  }],
  descriptions: [{
    language: {
      type: String,
      required: true,
      enum: ChapterLanguage
    },
    value: {
      type: String,
      required: true,
      maxlength: [2000, "Description cannot be more than 2000 characters"]
    }
  }],
  author: {
    type: String,
    required: [true, "Manga must have an author"],
    maxlength: [50, "Author name cannot be more than 40 characters"],
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
    views: {
      type: Number,
      default: 0
    },
    dailyViews: {
      type: Number,
      default: 0
    },
    weeklyViews: {
      type: Number,
      default: 0
    },
    monthlyViews: {
      type: Number,
      default: 0
    },
  },
  genres: {
    type: [String],
    enum: ComicsGenreSchema.Enum,
    default: []
  },
  languages: {
    type: [String],
    enum: ChapterLanguage,
    default: []
  },
  releaseYear: {
    type: Number,
    required: [true, "Manga must have a release year"]
  },
  uploadedBy: {
    type: String,
    required: [true, "Manga should have an uploader"]
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  isBanned: {
    type: Boolean,
    default: false
  },
},
    {
      toJSON: {
        virtuals: true
      },
      timestamps: true
    })

MangaSchema.index({ 'titles.language': 1, 'titles.value': 1 });

export default mongoose.models["Manga"] as MangaModel || model<Manga, MangaModel>("Manga", MangaSchema);