import mongoose, {model, Model, Schema} from "mongoose";
import {Bookmark} from "@/app/lib/graphql/schema";
import {nanoid} from "nanoid";

interface BookmarkModel extends Model<Bookmark> {}

const BookmarkSchema = new Schema<Bookmark>({
  id: {
    type: String,
    default: () => nanoid(),
    unique: true
  },
  userId: {
    type: String,
    required: [true, "Bookmark must have an user id"],
    unique: true
  },
  reading: {
    type: [String],
    default: []
  },
  finished: {
    type: [String],
    default: []
  },
  inPlans: {
    type: [String],
    default: []
  },
  dropped: {
    type: [String],
    default: []
  },
  favourite: {
    type: [String],
    default: []
  },
}, {timestamps: true})

export default mongoose.models["Bookmark"] as BookmarkModel || model<Bookmark, BookmarkModel>("Bookmark", BookmarkSchema);