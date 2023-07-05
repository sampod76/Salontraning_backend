import { Model } from 'mongoose';
import { IFileUploade } from '../fileUploade/interface.fileUploade';

export type ICategoryFilters = {
  searchTerm?: string;
  title?: string;
};

export type ICategory = {
  title: string;
  thumbnail?: string | IFileUploade;
};

export type CategoryModel = Model<ICategory, Record<string, unknown>>;
