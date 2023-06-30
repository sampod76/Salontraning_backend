import { Model } from 'mongoose';

export type IFileUploadeFilters = {
  searchTerm?: string;
  title?: string;
};

export type IFileUploade = {
  title: string;
  path: string;
  category?: string;
  tag?: string[];
};

export type FileUploadeModel = Model<IFileUploade, Record<string, unknown>>;
