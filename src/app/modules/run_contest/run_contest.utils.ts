// import { Contest } from './photoContest.model';

import { RunContest } from './run_contest.model';

export const findLastContestId = async () => {
  const lastContestId = await RunContest.findOne({}, { contestId: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();
  return lastContestId?.contestId ? lastContestId.contestId : undefined;
};

export const generateContestId = async (): Promise<number> => {
  const currentId = (await findLastContestId()) || 0;
  // increment by 1
  const incrementId = Number(currentId) + 1;
  return incrementId;
};
