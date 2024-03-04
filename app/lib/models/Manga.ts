import mongoose, {HydratedDocument, model, Schema} from "mongoose";
import {MangaCard, MangaDB, Chapter as IChapter, Manga as IManga} from "@/app/types";
import {MangaStatusSchema, ComicsTypeSchema, ComicsGenreSchema} from "@/app/lib/zodSchemas";
import {nanoid} from "nanoid";
import Chapter from "@/app/lib/models/Chapter";

// interface MangaMethods {
//   getVisitorsNr(): number,
// }
//
// // static methods
// interface MangaModel extends Model<MangaDB, {}, MangaMethods> {
//   getCardForm(id: string): Promise<HydratedDocument<MangaCard, MangaMethods> | null>
//   getFullForm(id: string): Promise<HydratedDocument<IManga, MangaMethods> | null>
// }

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
    enum: MangaStatusSchema.Enum,
    required: [true, "Manga must have a description"]
  },
  type: {
    type: String,
    enum: ComicsTypeSchema.Enum,
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
        default: 0
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
  genre: {
    type: [String],
    enum: ComicsGenreSchema.Enum,
    default: []
  },
  releaseYear: {
    type: Number,
    required: [true, "Manga must have a release year"]
  },
  postedOn: {
    type: Date,
    default: Date.now
  }
})

MangaSchema.methods.getVisitorsNr = function() {
  return this.stats.visitors.length;
}

MangaSchema.statics.getCardForm = async function(id: string): Promise<HydratedDocument<MangaCard> | null>{
  const manga = await this.findOne({id}, "title image chapters stats")

  if (!manga) return null;

  const lastChapter: HydratedDocument<IChapter> | null = await Chapter.findOne({id: manga.chapters[manga.chapters.length - 1]});

  const mangaCard: MangaCard = {
    title: manga.title,
    image: manga.image,
    chapter: lastChapter?.number || manga.chapters.length - 1,
    rating: manga.stats.rating.value || 0,
    status: manga.status,
    type: manga.type
  }

  return mongoose.models.Manga.hydrate(mangaCard);
}

MangaSchema.static("getFullForm", async function getFullForm(id: string): Promise<HydratedDocument<IManga> | null> {
  const manga: HydratedDocument<MangaDB> | null = await this.findOne({id});

  if (!manga) return null;

  // Getting manga with modified visitors array into a number of visitors length
  const modifiedManga: IManga = {...manga, stats: {...manga.stats, visitors: manga.stats.visitors.length}}

  return mongoose.models.Manga.hydrate(modifiedManga);
});

export default mongoose.models["Manga"] || model<MangaDB>("Manga", MangaSchema)