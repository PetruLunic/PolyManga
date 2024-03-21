import mongoose, {model, Schema} from "mongoose";
import {Chapter} from "@/app/lib/graphql/schema";
import {nanoid} from "nanoid";

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
  images: [{
    src: {
      type: String,
      required: [true, "Image should have a source"],
      maxlength: [100, "Source cannot be more than 100 characters"]
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
})

export default mongoose.models["Chapter"] || model<Chapter>("Chapter", ChapterSchema)