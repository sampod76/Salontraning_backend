import { Schema, model } from 'mongoose';
import { IModerator, ModeratorModel } from './moderator.interface';
import { ENUM_USER_ROLE } from '../../../enums/users';

const ModeratorSchema = new Schema<IModerator, ModeratorModel>(
  {
    name: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: String,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
    },
    role: {
      type: String,
      default: ENUM_USER_ROLE.MODERATOR,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      unique: true,
      required: true,
    },
    emergencyphone: {
      type: String,
    },

    address: {
      type: String,
    },

    designation: {
      type: String,
    },
    profileImage: {
      type: String,
      // required: true,
    },
    status: {
      type: String,
      enum: ['active', 'deactive'],
      default: 'active',
    },
    // academicModerator: {
    //   type: Types.ObjectId,
    //   ref: 'AcademicModerator',
    //   required: true,
    // },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Moderator = model<IModerator, ModeratorModel>(
  'Moderator',
  ModeratorSchema
);
