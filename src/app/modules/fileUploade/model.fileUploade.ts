import { Schema, Types, model } from 'mongoose';
import { FileUploadeModel, IFileUploade } from './interface.fileUploade';

const FileUploadeSchema = new Schema<IFileUploade, FileUploadeModel>(
  {
    userId: {
      //get request
      type: Types.ObjectId,
    },
    title: {
      type: String,
      lowercase: true,
      unique: true,
      trim: true,
    },
    path: {
      type: String,
      trim: true,
    },
    size: {
      type: Number,
      default: 0,
    },
    filename: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
    },
    category: {
      type: String,
      trim: true,
    },
    tag: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
    // strict: 'throw',
    toJSON: {
      virtuals: true,
    },
  }
);

export const FileUploade = model<IFileUploade, FileUploadeModel>(
  'FileUploade',
  FileUploadeSchema
);
