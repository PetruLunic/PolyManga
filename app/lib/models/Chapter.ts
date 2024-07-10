import mongoose, {model, Schema} from "mongoose";
import {Chapter} from "@/app/lib/graphql/schema";
import {nanoid} from "nanoid";
import {ChapterLanguage} from "@/app/types";

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
  title: {
    type: String,
    required: [true, "Chapter must have a title"],
    maxlength: [50, "Title cannot be more than 50 characters"]
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
    }]
  }],
}, {timestamps: true})

export default mongoose.models["Chapter"] || model<Chapter>("Chapter", ChapterSchema)