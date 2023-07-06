import { Model } from 'mongoose';
import { IGeneralUser } from '../generalUser/interface.GeneralUser';
import { IRunContest } from '../run_contest/run_contest.interface';
import { IFileUploade } from '../fileUploade/interface.fileUploade';

// import { IFileUploade } from '../fileUploade/interface.fileUploade';

export type IPhotoContestUserFilters = {
  searchTerm?: string;
  title?: string;
  status?: 'active' | 'deactive';
  contest?: string;
};

export type IPhotoContestUserSearchableField = {
  name?: string;
  header_1?: string;
  description?: string;
};

export type IPhotoContestUser = {
  userId: string | IGeneralUser;
  contest: string | IRunContest;
  name?: string;
  email: string;
  phone: string;
  header_1?: string;
  description?: string;
  thumbnail?: string | IFileUploade;
  // thumbnail: string;
  status?: 'active' | 'deactive';
  loveReacts?: Array<string | IGeneralUser>;
  messages?: Array<{
    userId: string | IGeneralUser;
    message: string;
  }>;
  share?: Array<string | IGeneralUser>;
  winnerData?: {
    contest: string;
    contest_number?: string;
    date?: string;
    winner: number;
  };
};

export type PhotoContestUserModel = Model<
  IPhotoContestUser,
  Record<string, unknown>
>;
