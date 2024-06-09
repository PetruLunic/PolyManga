import mongoose, {model, Model, Schema} from "mongoose";
import {nanoid} from "nanoid";
import {Rating} from "@/app/lib/graphql/schema";

interface RatingModel extends Model<Rating> {}

const RatingSchema = new Schema<Rating>({
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
    required: [true, "Rating must have an manga id"]
  },
  value: {
    type: Number,
    required: [true, "Rating must have a value"],
    max: 10,
    min: 1
  }
});

// Define a compound index on userId and objectId
RatingSchema.index({ userId: 1, mangaId: 1 }, { unique: true });

export default mongoose.models["Rating"] as RatingModel || model<Rating, RatingModel>("Rating", RatingSchema);