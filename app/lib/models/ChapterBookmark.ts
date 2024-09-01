import mongoose, {model, Model, Schema} from "mongoose";
import {ChapterBookmark} from "@/app/lib/graphql/schema";
import {nanoid} from "nanoid";

interface ChapterBookmarkModel extends Model<ChapterBookmark> {}

const ChapterBookmarkSchema = new Schema<ChapterBookmark>({
  id: {
    type: String,
    default: () => nanoid(),
    unique: true
  },
  userId: {
    type: String,
    required: [true, "Bookmark must have an user id"],
  },
  mangaId: {
    type: String,
    required: [true, "Bookmark must have a manga id"],
  },
  chapterId: {
    type: String,
    required: [true, "Bookmark must have a chapter id"],
  },
}, {timestamps: true})

ChapterBookmarkSchema.index({userId: 1, chapterId: 1}, {unique: true});

export default mongoose.models["ChapterBookmark"] as ChapterBookmarkModel || model<ChapterBookmark, ChapterBookmarkModel>("ChapterBookmark", ChapterBookmarkSchema);