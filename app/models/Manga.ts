import mongoose, {model, Schema} from "mongoose";
import {Manga} from "@/app/types";
import {MangaStatusSchema, ComicsTypeSchema} from "@/app/lib/zodSchemas";
import {ChapterSchema} from "@/app/models/Chapter";

const MangaSchema = new Schema<Manga>({
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
  chapters: [ChapterSchema]
})

export default mongoose.models["Manga"] || model<Manga>("Manga", MangaSchema)