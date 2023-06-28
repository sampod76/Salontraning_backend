import { Schema, Types, model } from 'mongoose';
import { LessionModel, ILession } from './lession.interface';

const LessionSchema = new Schema<ILession, LessionModel>(
  {
    lessionId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    vedio_link: {
      type: String,
      trim: true,
      required: true,
    },
    time: Number,
    header_1: {
      type: String,
      trim: true,
    },
    header_2: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    thimble: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'deactive'],
    },
    tag: [
      {
        type: String,
      },
    ],
    course: {
      type: Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    courseId: {
      type: String,
    },
  },
  {
    timestamps: true,
    // strict: 'throw',
    toJSON: {
      virtuals: true,
    },
  }
);

export const Lession = model<ILession, LessionModel>('Lession', LessionSchema);
