import { Schema, Types, model } from 'mongoose';
import { ILession, LessionModel } from './lession.interface';

const LessionSchema = new Schema<ILession, LessionModel>(
  {
    lessionId: {
      // auto generate
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    courseTitle: String,
    vedio: {
      type: {
        link: {
          type: String,
          trim: true,
          required: true,
        },
        player_no: Number,
      },
    },
    serial_no: Number,
    duration: Number,
    publish_date: Date,
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
    thumbnail: {
      type: Types.ObjectId,
      ref: 'FileUploade',
      // required: true,
    },
    status: {
      type: String,
      enum: ['active', 'deactive', 'save'],
      default: 'active',
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
