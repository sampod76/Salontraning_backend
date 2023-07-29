import { Model } from 'mongoose';

type IOtherInfo = { uid: string; photoURL: string };

type IPurchaseCourses = {
  course: string;
  quiz?: [];
  total_completed_lessions?: string[];
};

export type IGeneralUser = {
  _id: unknown;
  // _id?: string;
  name: string; //embedded object
  gender?: 'male' | 'female';
  dateOfBirth?: string;
  password?: string;
  email?: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  uid?: string;
  otherInfo?: IOtherInfo;
  role: string;
  status?: 'active' | 'deactive';
  learnedToday?: {
    date?: string;
    time?: number;
  };
  purchase_courses?: IPurchaseCourses[];
};

export type GeneralUserModel = Model<IGeneralUser, Record<string, unknown>>;

export type IGeneralUserFilters = {
  searchTerm?: string;
  email?: string;
  phone?: string;
  status?: string;
};
