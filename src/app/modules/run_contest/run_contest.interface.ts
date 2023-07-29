import { Model } from 'mongoose';
import { IFileUploade } from '../fileUploade/interface.fileUploade';

// import { IFileUploade } from '../fileUploade/interface.fileUploade';

export type IRunContestFilters = {
  searchTerm?: string;
  title?: string;
  select?: string;
  status?: 'active' | 'deactive' | 'save';
};

export type IRunContestSearchableField = {
  title?: string;
  header_1?: string;
  description?: string;
};

export type IWinnerPrize = {
  title: string;
  thumbnail?: string;
  prize_serial?: number;
  prize_value?: number;
};

export type IWinnerList = {
  photo_contest_id: string; // Assuming Types.ObjectId is a string type
  userId: string; // Assuming Types.ObjectId is a string type
  email?: string;
  name?: string;
  phone?: string;
};

export type IRunContest = {
  contestId: number;
  title?: string;
  header_1?: string;
  description?: string;
  thumbnail?: string | IFileUploade;
  // images_album: (string | IFileUploade)[];
  images_album: Array<string | IFileUploade>;
  status?: 'active' | 'deactive' | 'save';
  winnerList?: IWinnerList[];
  winnerPrize?: IWinnerPrize[];
  total_winer: {
    number: number;
    condition: object;
  };
  duration_time: {
    startDate: string;
    endDate: string;
  };
};

export type RunContestModel = Model<IRunContest, Record<string, unknown>>;
