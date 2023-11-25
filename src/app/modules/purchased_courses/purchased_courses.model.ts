import { Schema, Types, model } from 'mongoose';
import { ICourse } from '../course/course.interface';
import { Course } from '../course/course.model';
import {
  IPurchased_courses,
  Purchased_coursesModel,
} from './purchased_courses.interface';

const purchasedCoursesSchema = new Schema<
  IPurchased_courses,
  Purchased_coursesModel
>(
  {
    userId: {
      type: Types.ObjectId,
      ref: 'General_user',
      required: true,
    },
    userName: {
      type: String,
      trim: true,
      // required: true,
    },
    email: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },

    payment: {
      type: {
        price: {
          // not provide
          type: Number,
          trim: true,
        },
        vat: {
          // not provide
          type: Number,
        },
        discount: {
          // not provide
          type: Number,
        },
        total: {
          // not provide
          type: Number,
        },
        method: {
          type: String,
          enum: ['stripe', 'paypal','manual', 'free','other','revenueCat'],
        },
        paymentType: {
          type: String,
          // enum: ['card'],
          default: 'card',
        },

        method_TransactionID: {
          //
          type: String,
        },
        productId: {
          //
          type: String,
        },
        revenueCatId: {
          //
          type: String,
        },
      },
      default: {},
    },

    course: {
      // couser-> _id
      type: Types.ObjectId,
      ref: 'Course',
      required: true,
    },

    transactionID: String, // not provide
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// All calculations will be done here while buying any product
purchasedCoursesSchema.pre('save', async function (next) {
  const {
    price = 0,
    discount = { value: 0 },
    vat = 0,
  } = (await Course.findById(this.course)) as ICourse;

  if (
    (discount.expiryDate && new Date(discount.expiryDate) < new Date()) ||
    (discount.startDate && new Date(discount.startDate) > new Date())
  ) {
    discount.value = 0;
  }

  const afterDiscount = price - (price / 100) * discount.value;
  this.payment.total = afterDiscount + (afterDiscount / 100) * vat;
  this.payment.discount = discount.value;
  this.payment.vat = vat;
  this.payment.price = price;
  next();
  // Math.random().toString(16).slice(2);
});

export const Purchased_courses = model<
  IPurchased_courses,
  Purchased_coursesModel
>('PurchasedCourses', purchasedCoursesSchema);
