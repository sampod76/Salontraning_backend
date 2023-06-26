import { Schema, model } from 'mongoose';
import { CourseModel, ICourse } from './course.interface';

const courseSchema = new Schema<ICourse, CourseModel>(
  {
    courseId: {
      type: String,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    header_1: String,
    header_2: String,
    description: String,
    thimble: String,
    publish: {
      type: {
        status: {
          type: Boolean,
          default: true,
        },
        time: String,
      },
    },
    publisher: {
      // type: mongoose.Schema.Types.ObjectId,
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    publisherName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'deactive'],
      default: 'active',
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

export const Course = model<ICourse, CourseModel>('Course', courseSchema);
