import { SortOrder, Types } from 'mongoose';
import { paginationHelper } from '../../../helper/paginationHelper';

import { Request } from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';
import { RunContest } from './run_contest.model';

import { RUNCONTEST_SEARCHABLE_FIELDS } from './run_contest.consent';
import { IRunContest, IRunContestFilters } from './run_contest.interface';
import { generateContestId } from './run_contest.utils';

const createRunContestByDb = async (
  payload: IRunContest
): Promise<IRunContest | null> => {
  const contestId = await generateContestId();
  console.log(payload);
  const result = (await RunContest.create({ ...payload, contestId })).populate(
    'winnerPrize.thumbnail winnerList.photo_contest_id'
  );
  return result;
};

//getAllRunContestFromDb
const getAllRunContestFromDb = async (
  filters: IRunContestFilters,
  paginationOptions: IPaginationOption
): Promise<IGenericResponse<IRunContest[]>> => {
  //****************search and filters start************/
  const { searchTerm, select, ...filtersData } = filters;
  const projection: any = {};
  if (select) {
    const fieldNames = select?.split(',').map(field => field.trim());
    // Create the projection object
    fieldNames.forEach(field => {
      projection[field] = 1;
    });
  }
  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: RUNCONTEST_SEARCHABLE_FIELDS.map(field =>
        //search array value
        field === 'tag'
          ? { [field]: { $in: [new RegExp(searchTerm, 'i')] } }
          : {
              [field]: new RegExp(searchTerm, 'i'),
            }
      ),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  //****************search and filters end**********/

  //****************pagination start **************/
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  //****************pagination end ***************/

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  let result = null;
  if (select) {
    result = await RunContest.find({}).select({ ...projection });
  } else {
    result = await RunContest.find(whereConditions)
      .populate('winnerPrize.thumbnail winnerList.photo_contest_id')
      .sort(sortConditions)
      .skip(Number(skip))
      .limit(Number(limit));
  }

  const total = await RunContest.countDocuments(whereConditions);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// get single e form db
const getSingleRunContestFromDb = async (
  id: string
): Promise<IRunContest | null> => {
  const result = await RunContest.findById(id).populate(
    'winnerPrize.thumbnail winnerList.photo_contest_id'
  );
  return result;
};

// update e form db
const updateRunContestFromDb = async (
  id: string,
  req: Request,
  payload: Partial<IRunContest>
): Promise<IRunContest | null> => {
  const result = await RunContest.findOneAndUpdate(
    { _id: new Types.ObjectId(id) },
    payload,
    {
      new: true,
    }
  );
  return result;
};

// delete e form db
const deleteRunContestByIdFromDb = async (
  id: string,
  req: Request
): Promise<IRunContest | null> => {
  const quary: { userId?: string; _id: string } = {
    _id: id,
  };
  if (req?.user?.role !== ENUM_USER_ROLE.ADMIN) {
    quary.userId = req?.user?._id;
  }
  const result = await RunContest.findOneAndDelete(quary);
  return result;
};

export const RunContestService = {
  createRunContestByDb,
  getAllRunContestFromDb,
  getSingleRunContestFromDb,
  updateRunContestFromDb,
  deleteRunContestByIdFromDb,
};
