import { Model, Types } from 'mongoose';
import { ICourse } from '../course/course.interface';

export type ILessionFilters = {
  searchTerm?: string;
  title?: string;
  status?: 'active' | 'deactive';
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
  thimble?: string;
  status?: 'active' | 'deactive';
  tag?: string[];
  vedio_link: string;
  course: Types.ObjectId | ICourse;
  courseId: string;
};

export type LessionModel = Model<ILession, Record<string, unknown>>;
