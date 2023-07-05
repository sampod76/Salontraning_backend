import { Model } from 'mongoose';
import { IPhotoContestUser } from '../photoContest/photoContest.interface';

// import { IFileUploade } from '../fileUploade/interface.fileUploade';

export type IRunContestFilters = {
  searchTerm?: string;
  title?: string;
  status?: 'active' | 'deactive';
};

export type IRunContestSearchableField = {
  title?: string;
  header_1?: string;
  description?: string;
};

export type IRunContest = {
  title?: string;
  header_1?: string;
  description?: string;
  // thumbnail?: string | IFileUploade;
  status?: 'active' | 'deactive';
  winnerList?: IPhotoContestUser[];
  winnerPrice?: [];
  duration_time: {
    startDate: string;
    endDate: string;
  };
};

export type RunContestModel = Model<IRunContest, Record<string, unknown>>;
