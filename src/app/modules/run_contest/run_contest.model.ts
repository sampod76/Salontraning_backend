import { Schema, Types, model } from 'mongoose';
import { IRunContest, RunContestModel } from './run_contest.interface';

const RunContestSchema = new Schema<IRunContest, RunContestModel>(
  {
    title: String,
    header_1: String,
    description: String,
    // thumbnail: String or IFileUploadeMongooseSchema (depending on the type),
    status: {
      type: String,
      enum: ['active', 'deactive'],
    },
    winnerList: [
      {
        photo_contest_id: {
          type: Types.ObjectId,
          ref: 'Photo_contest_user',
          require: [true, 'user id is required'],
        },
        email: String,
        name: String,
        phone: String,
      },
    ],
    winnerPrice: [],
    duration_time: {
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
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
RunContestSchema.virtual('winnerListUsers', {
  ref: 'Photo_contest_user',
  localField: 'winnerList',
  foreignField: '_id',
  justOne: false,
});
export const RunContest = model<IRunContest, RunContestModel>(
  'Photo_contest',
  RunContestSchema
);
