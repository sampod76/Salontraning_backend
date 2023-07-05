import { Model } from 'mongoose';

export type ICategoryFilters = {
  searchTerm?: string;
  title?: string;
};

export type ICategory = {
  title: string;
  thumbnail?: string;
};

export type CategoryModel = Model<ICategory, Record<string, unknown>>;
