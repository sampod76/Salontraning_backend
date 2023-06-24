import { Model, Types } from 'mongoose';
import { IUser } from '../users/users.interface';

export type ICourseFilters = {
  searchTerm?: string;
  title?: string;
  price?: number;
  'publish.status'?: string;
  publisherName?: string;
};

export type ICourseSearchableField = {
  title: string;
  publisherName: string;
  header_1: string;
  header_2: string;
  description: string;
  courseId: string;
};

export type IPublish = {
  status: boolean;
  time: string;
};

export type ICourse = {
  courseId: string;
  title: string;
  price?: number;
  header_1?: string;
  header_2?: string;
  description?: string;
  thimble?: string;
  publish?: IPublish;
  publisher: Types.ObjectId | IUser;
  publisherName: string;
  status?: 'active' | 'deactive';
};

export type CourseModel = Model<ICourse, Record<string, unknown>>;
