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
    learnedToday: {
      type: {
        date: {
          type: Date,
        },
        time: {
          type: Number,
        },
      },
    },
    purchase_courses: [
      {
        course: { type: Types.ObjectId, ref: 'Course' },
        quiz: [],
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

GeneralUserSchema.statics.isUserExist = async function (
  id: string,
  courseId: string
): Promise<string | null> {
  const result = await GeneralUser.findById(id);
  const CourseIdExaite = result?.purchase_courses?.find(
    value => value.course === courseId
  );
  return CourseIdExaite?.course || null;
};

export const GeneralUser = model<IGeneralUser, GeneralUserModel>(
  'General_user',
  GeneralUserSchema
);
