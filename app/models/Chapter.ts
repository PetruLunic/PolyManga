import mongoose, {model, Schema} from "mongoose";
import {Chapter} from "@/app/types";

export const ChapterSchema = new Schema<Chapter>({
  title: {
    type: String,
    required: [true, "Chapter must have a title"],
    maxlength: [50, "Title cannot be more than 50 characters"]
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