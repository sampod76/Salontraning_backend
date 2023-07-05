import { Schema, Types, model } from 'mongoose';
import {
  IPhotoContestUser,
  PhotoContestUserModel,
} from './photoContest.interface';

const PhotoContestSchemaUser = new Schema<
  IPhotoContestUser,
  PhotoContestUserModel
>(
  {
    userId: {
      type: Types.ObjectId,
      required: true,
      ref: 'General_user',
    },
    name: String,
    email: String,
    phone: String,

    header_1: String,
    description: String,
    thumbnail: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'deactive'],
      default: 'active',
    },
    loveReact: [
      {
        type: Types.ObjectId,
        ref: 'General_user',
      },
    ],
    messages: [
      {
        userId: {
          type: Types.ObjectId,

          ref: 'General_user',
        },
        message: {
          type: String,
        },
      },
    ],
    share: {
      type: Number,
      default: 0,
    },
    winnerData: {
      type: {
        contest_id: { type: Types.ObjectId },
        contest_number: { type: String },
        date: {
          type: String,
        },
        winner: {
          type: Number,
        },
      },
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

export const PhotoContestUser = model<IPhotoContestUser, PhotoContestUserModel>(
  'Photo_contest_user',
  PhotoContestSchemaUser
);
