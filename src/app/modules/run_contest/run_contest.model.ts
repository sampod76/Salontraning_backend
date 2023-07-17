import { Schema, Types, model } from 'mongoose';
import { IRunContest, RunContestModel } from './run_contest.interface';

const RunContestSchema = new Schema<IRunContest, RunContestModel>(
  {
    contestId: { type: Number, min: 0 },
    title: String,
    header_1: String,
    description: String,
    // thumbnail: String or IFileUploadeMongooseSchema (depending on the type),
    thumbnail: {
      type: Types.ObjectId,
      ref: 'FileUploade',
      // required: true,
    },
    status: {
      type: String,
      enum: ['active', 'deactive', 'save'],
    },

    winnerPrize: [
      {
        title: String,
        thumbnail: {
          type: Types.ObjectId,
          ref: 'FileUploade',
          // required: true,
        },
        prize_serial: { type: Number },
        prize_value: Number,
      },
    ],

    duration_time: {
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
    },
    total_winer: {
      number: { type: Number, min: 0 },
      condition: {
        type: Object,
      },
    },
    //after contest end then update
    winnerList: [
      {
        photo_contest_id: {
          type: Types.ObjectId,
          ref: 'Photo_contest_user',
          // require: [true, 'photo_contest_id is required'],
        },
        email: String,
        name: String,
        phone: String,
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

export const RunContest = model<IRunContest, RunContestModel>(
  'RunContest',
  RunContestSchema
);
