import mongoose, {model, Model, Schema} from "mongoose";
import {nanoid} from "nanoid";
import {Like} from "@/app/lib/graphql/schema";
import {likeableObjects} from "@/app/types";

interface LikeModel extends Model<Like> {}

const LikeSchema = new Schema<Like>({
  id: {
    type: String,
    default: () => nanoid(),
    unique: true
  },
  userId: {
    type: String,
    required: [true, "Like must have an user id"]
  },
  mangaId: {
    type: String,
    required: [true, "Object must have an id"]
  }
});

// Define a compound index on userId and objectId
LikeSchema.index({ userId: 1, mangaId: 1 }, { unique: true });

export default mongoose.models["Like"] as LikeModel || model<Like, LikeModel>("Like", LikeSchema);