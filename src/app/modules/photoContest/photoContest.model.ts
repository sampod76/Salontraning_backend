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
    message: [
      {
        userId: {
          type: Types.ObjectId,
          required: true,
          ref: 'General_user',
        },
        message: {
          type: String,
          required: true,
        },
      },
    ],
    share: {
      type: Number,
      default: 0,
    },
    winnerData: {
      date: {
        type: String,
        required: true,
      },
      winner: {
        type: Number,
        required: true,
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
