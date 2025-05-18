import mongoose, {Model, model, Schema} from "mongoose";
import {ChapterMetadataRaw} from "@/app/lib/graphql/schema";
import {nanoid} from "nanoid";
import {locales} from "@/i18n/routing";

interface ChapterMetadataModel extends Model<ChapterMetadataRaw> {}

export const ChapterMetadataSchema = new Schema<ChapterMetadataRaw>({
  id: {
    type: String,
    default: () => nanoid(),
    unique: true
  },
  chapterId: {
    type: String,
    unique: true,
    required: true
  },
  content: [{
    style: {
      backgroundColor: {
        type: String
      },
      textAlign: {
        type: String
      },
      borderRadius: {
        type: String
      }
    },
    translatedTexts: [{
      language: {
        type: String,
        enum: locales,
        required: true
      },
      text: {
        type: String,
        required: true
      },
      fontSize: {
        type: Number,
        default: 22
      }
    }],
    coords: [{
      coord: {
        x1: {
          type: Number,
          required: true
        },
        y1: {
          type: Number,
          required: true
        },
        x2: {
          type: Number,
          required: true
        },
        y2: {
          type: Number,
          required: true
        }
      },
      language: {
        type: String,
        enum: locales,
        required: true
      }
    }]
  }]
}, {timestamps: true})

export default mongoose.models["ChapterMetadata"] as ChapterMetadataModel || model<ChapterMetadataRaw, ChapterMetadataModel>("ChapterMetadata", ChapterMetadataSchema)