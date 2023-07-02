import { Schema, Types, model } from 'mongoose';
import { ENUM_USER_ROLE } from '../../../enums/users';
import { GENDER } from './constant.GeneralUser';
import { GeneralUserModel, IGeneralUser } from './interface.GeneralUser';
const GeneralUserSchema = new Schema<IGeneralUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: GENDER,
    },
    role: {
      type: String,
      default: ENUM_USER_ROLE.GENERAL_USER,
    },
    dateOfBirth: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      // required: true,
    },
    phone: {
      type: String,
      unique: true,
      // required: true,
    },
    profileImage: {
      type: String,
      // required: true,
    },
    uid: {
      type: String,
      unique: true,
    },
    status: {
      type: String,
      enum: ['active', 'deactive'],
      default: 'active',
    },
    purchase_courses: [
      {
        course: { type: Types.ObjectId, ref: 'Course' },
        quiz: [{ quizId: String, provided_answer: String }],
        total_completed_lessions: [Types.ObjectId],
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const GeneralUser = model<IGeneralUser, GeneralUserModel>(
  'General_user',
  GeneralUserSchema
);
