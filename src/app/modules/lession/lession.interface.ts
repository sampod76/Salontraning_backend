import { Model, Types } from 'mongoose';
import { ICourse } from '../course/course.interface';
import { IFileUploade } from '../fileUploade/interface.fileUploade';

export type ILessionFilters = {
  searchTerm?: string;
  title?: string;
  status?: 'active' | 'deactive' | 'save';
};

export type ILessionSearchableField = {
  title?: string;
  header_1?: string;
  header_2?: string;
  description?: string;
  lessonId?: string;
};

export type ILession = {
  lessionId: string;
  title: string;
  header_1?: string;
  header_2?: string;
  description?: string;
  thumbnail?: string | IFileUploade;
  status?: 'active' | 'deactive' | 'save';
  tag?: string[];
  duration?: string;
  vedio: { link: string; player_no: number };
  serial_no: number;
  course: Types.ObjectId | ICourse;
  courseId: string;
};

export type LessionModel = Model<ILession, Record<string, unknown>>;
