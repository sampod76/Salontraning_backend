import { Model } from 'mongoose';
import { IAdmin } from '../admin/admin.interface';
import { IGeneralUser } from '../generalUser/interface.GeneralUser';

export type IFileUploadeFilters = {
  searchTerm?: string;
  title?: string;
};

export type IFileUploade = {
  userId: string | IAdmin | IGeneralUser;
  title: string;
  originalname: string;
  path: string;
  size?: number;
  mimetype?: string;
  category?: string;
  tag?: string[];
};

export type FileUploadeModel = Model<IFileUploade, Record<string, unknown>>;