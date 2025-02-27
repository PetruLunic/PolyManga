import mongoose, {Model, model, Schema} from "mongoose";
import {Chapter} from "@/app/lib/graphql/schema";
import {nanoid} from "nanoid";
import {ChapterLanguage} from "@/app/types";

interface ChapterModel extends Model<Chapter> {}

export const ChapterSchema = new Schema<Chapter>({
  id: {
    type: String,
    default: () => nanoid(),
    unique: true
  },
  number: {
    type: Number,
    required: [true, "Chapter must have a order number"],
    min: 0
  },
  mangaId: {
    type: String,
    required: [true, "Chapter must be linked to a manga"]
  },
  versions: [{
    language: {
      type: String,
      enum: ChapterLanguage,
      required: true
    },
    images: [{
      src: {
        type: String,
        required: [true, "Image should have a source"],
        maxlength: [200, "Source cannot be more than 200 characters"]
      },
      width: {
        type: Number,
        required: [true, "Image should have a width"],
      },
      height: {
        type: Number,
        required: [true, "Image should have a height"],
      }
    }],
    title: {
      type: String,
      required: [true, "Chapter must have a title"],
      maxlength: [50, "Title cannot be more than 50 characters"]
    },
  }],
}, {timestamps: true})

ChapterSchema.index({ number: 1, mangaId: 1 }); // Unique chapter number per manga

export default mongoose.models["Chapter"] as ChapterModel || model<Chapter, ChapterModel>("Chapter", ChapterSchema)