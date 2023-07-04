import { Schema, model } from 'mongoose';
import { COURSE_TYPES } from './course.consent';
import { CourseModel, ICourse } from './course.interface';
// import { format } from 'date-fns';

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
      min: 0,
    },
    type: {
      type: String,
      enum: COURSE_TYPES, // ['free', 'paid', 'open', 'close']
    },
    category: {
      type: String,
      lowercase: true,
      trim: true,
    },
    discount: {
      type: {
        value: {
          type: Number,
          default: 0,
        },
        startDate: {
          type: Date,
        },
        expiryDate: {
          type: Date,
        },
      },
    },
    vat: {
      type: Number,
      default: 0,
    },
    header_1: String,
    header_2: String,
    description: String,
    thumbnail: String,
    publish: {
      type: {
        status: {
          type: String,
          enum: ['active', 'deactive', 'save'],
          default: 'active',
        },
        time: {
          type: Date,
          // default: () => {
          //   // Get the current date
          //   const today = new Date();
          //   const dateString = format(today, 'yyyy-MM-dd');
          //   return dateString;
          // },
        },
      },
    },
    publisher: {
      // type: mongoose.Schema.Types.ObjectId,
      type: Schema.Types.ObjectId,
      ref: 'Moderator',
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
