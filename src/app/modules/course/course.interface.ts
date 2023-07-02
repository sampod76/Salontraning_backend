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
  status: 'active' | 'deactive' | 'save';
  time: string;
};

export type ICourse = {
  courseId: string;
  title: string;
  price?: number;
  type: 'free' | 'paid' | 'open' | 'close';
  category: string;
  discount?: {
    value: number;
    startDate?: string;
    expiryDate?: string;
  };
  vat?: number;
  header_1?: string;
  header_2?: string;
  description?: string;
  thumbnail?: string;
  publish?: IPublish;
  publisher: Types.ObjectId | IUser;
  publisherName: string;
  status?: 'active' | 'deactive';
  tag?: string[];
};

export type CourseModel = Model<ICourse, Record<string, unknown>>;
