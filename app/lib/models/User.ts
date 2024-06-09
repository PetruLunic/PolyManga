import mongoose, {model, Model, Schema} from "mongoose";
import {User} from "@/app/lib/graphql/schema";
import {nanoid} from "nanoid";
import {UserProvider, UserRole} from "@/app/types";
import Bookmark from "@/app/lib/models/Bookmark";

interface UserModel extends Model<User> {}

const USER_NO_IMAGE_SRC = "/user-no-image.jpg";

const UserSchema = new Schema<User>({
  id: {
    type: String,
    default: () => nanoid(),
    unique: true
  },
  name: {
    type: String,
    required: [true, "User must have an username"],
    minlength: [3, "Username must be at least 3 characters long"],
    maxlength: [50, "Username cannot be more than 50 characters"],
    unique: true
  },
  email: {
    type: String,
    required: [true, "User must have an email"],
    maxlength: [50, "Email cannot be more than 50 characters"],
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
    unique: true
  },
  password: {
    type: String,
    required: function() {return this.provider === "CREDENTIALS"},
    minlength: [8, "Password must be at least 8 characters long"],
    maxlength: [64, "Email cannot be more than 64 characters"],
  },
  image: {
    type: String,
    maxlength: [200, "Image cannot be more than 200 characters"],
    default: USER_NO_IMAGE_SRC
  },
  role: {
    type: String,
    enum: Object.keys(UserRole),
    default: UserRole.USER,
  },
  bookmarkId: {
    type: String,
    unique: true
  },
  provider: {
    type: String,
    enum: Object.keys(UserProvider),
    default: UserProvider.CREDENTIALS
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailToken: {
    type: String,
    default: () => nanoid(6)
  },
  emailTokenExpiry: {
    type: String,
    default: () => new Date().toISOString()
  }
}, {timestamps: true})

// Pre-save hook to create a bookmarks document for a new user
UserSchema.pre('save', async function (next) {
  if (this.isNew) {
    const bookmark = new Bookmark({ userId: this.id });
    await bookmark.save();
    this.bookmarkId = bookmark.id;
  }
  next();
});

// Post-remove hook to delete the bookmarks document when a user is deleted
UserSchema.post('deleteOne', async function (doc) {
  await Bookmark.deleteOne({ userId: doc.id });
});

export default mongoose.models["User"] as UserModel || model<User, UserModel>("User", UserSchema);