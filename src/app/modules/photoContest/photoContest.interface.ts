import { Model } from 'mongoose';
import { IGeneralUser } from '../generalUser/interface.GeneralUser';
import { IRunContest } from '../run_contest/run_contest.interface';

// import { IFileUploade } from '../fileUploade/interface.fileUploade';

export type IPhotoContestUserFilters = {
  searchTerm?: string;
  title?: string;
  status?: 'active' | 'deactive';
};

export type IPhotoContestUserSearchableField = {
  name?: string;
  header_1?: string;
  description?: string;
};

export type IPhotoContestUser = {
  userId: string | IGeneralUser;
  contest_id: string | IRunContest;
  name?: string;
  email: string;
  phone: string;
  header_1?: string;
  description?: string;
  // thumbnail?: string | IFileUploade;
  thumbnail: string;
  status?: 'active' | 'deactive';
  loveReact?: Array<string | IGeneralUser>;
  messages?: Array<{
    userId: string | IGeneralUser;
    message: string;
  }>;
  share?: number;
  winnerData?: {
    contest_id: string;
    contest_number?: string;
    date?: string;
    winner: number;
  };
};

export type PhotoContestUserModel = Model<
  IPhotoContestUser,
  Record<string, unknown>
>;
