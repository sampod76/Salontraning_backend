import { Schema, Types, model } from 'mongoose';
import { INotification, NotificationModel } from './interface.notification';

const NotificationSchema = new Schema<INotification, NotificationModel>(
  {
    title: {
      type: String,
      trim: true,
    },
    subTitle: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    thumbnail: {
      type: Types.ObjectId,
      ref: 'FileUploade',
    },
    body: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'General_user',
      },
    ],
    status: {
      type: String,
      default: 'active',
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

export const Notification = model<INotification, NotificationModel>(
  'Notification',
  NotificationSchema
);
