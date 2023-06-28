import { Model, Types } from 'mongoose';
import { ICourse } from '../course/course.interface';

export type IQuizFilters = {
  searchTerm?: string;
  title?: string;
  status?: 'active' | 'deactive';
};

export type IQuizSearchableField = {
  title?: string;
  header_1?: string;
  header_2?: string;
  description?: string;
  courseId?: string;
};

export type IQuizList = {
  title: string;
  serial_no: number;
  answers: string[];
  hint?: string;
  header_1?: string;
  header_2?: string;
  description?: string;
  thimble?: string;
  tag?: string[];
};

// model type
export type IQuiz = {
  quizId?: string;
  quizList: IQuizList[];
  course: Types.ObjectId | ICourse;
  courseId: string;
  status?: 'active' | 'deactive';
};

export type QuizModel = Model<IQuiz, Record<string, unknown>>;
