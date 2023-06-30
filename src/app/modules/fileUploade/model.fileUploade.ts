import { Schema, model } from 'mongoose';
import { FileUploadeModel, IFileUploade } from './interface.fileUploade';

const FileUploadeSchema = new Schema<IFileUploade, FileUploadeModel>(
  {
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
