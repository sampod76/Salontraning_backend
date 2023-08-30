import { Model } from 'mongoose';
import { IFileUploade } from '../fileUploade/interface.fileUploade';

export type INotificationFilters = {
  searchTerm?: string;
  title?: string;
  status?: string;
};

export type INotification = {
  title: string;
  subTitle?: string | undefined;
  thumbnail?: string | IFileUploade;
  imageUrl?: string | undefined;
  body:string
  icon?:string
  status?: string;
  users?:string[]
};

export type NotificationModel = Model<INotification, Record<string, unknown>>;
