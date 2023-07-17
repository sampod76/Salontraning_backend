import { Model, Types } from 'mongoose';
import { ICourse } from '../course/course.interface';
import { IGeneralUser } from '../generalUser/interface.GeneralUser';

export type IPurchased_coursesFilters = {
  searchTerm?: string;
  title?: string;
  status?: 'active' | 'deactive';
};

export type IPurchased_coursesSearchableField = {
  title?: string;
  header_1?: string;
  header_2?: string;
  description?: string;
  lessonId?: string;
};

export type IPayment = {
  price?: number;
  vat?: number;
  discount?: number;
  total: number;
  method?: string;
  paymentType?: string;
  method_TransactionID?: string;
};

export type IPurchased_courses = {
  userId: Types.ObjectId | IGeneralUser | any;
  userName?: string;
  email?: string;
  phone?: string;
  payment: IPayment;
  transactionID: string;
  course: Types.ObjectId | ICourse | any;
  courseId?: string;
};

export type Purchased_coursesModel = Model<
  IPurchased_courses,
  Record<string, unknown>
>;
