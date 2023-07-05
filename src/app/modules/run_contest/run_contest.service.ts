import { SortOrder } from 'mongoose';
import { paginationHelper } from '../../../helper/paginationHelper';

import { Request } from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';
import { RunContest } from './run_contest.model';

import { IRunContest, IRunContestFilters } from './run_contest.interface';
import { RUNCONTEST_SEARCHABLE_FIELDS } from './run_contest.consent';

const createRunContestByDb = async (
  payload: IRunContest
): Promise<IRunContest | null> => {
  const result = await RunContest.create(payload);
  return result;
};

//getAllRunContestFromDb
const getAllRunContestFromDb = async (
  filters: IRunContestFilters,
  paginationOptions: IPaginationOption
): Promise<IGenericResponse<IRunContest[]>> => {
  //****************search and filters start************/
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: RUNCONTEST_SEARCHABLE_FIELDS.map(field =>
        //search array value
        field === 'tag'
          ? { [field]: { $in: new RegExp(searchTerm, 'i') } }
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

  const result = await RunContest.find(whereConditions)
    .sort(sortConditions)
    .skip(Number(skip))
    .limit(Number(limit));

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
  const result = await RunContest.findById(id).polygon('winnerListUsers');
  return result;
};

// update e form db
const updateRunContestFromDb = async (
  id: string,
  req: Request,
  payload: Partial<IRunContest>
): Promise<IRunContest | null> => {
  const quary: { userId?: string; _id: string } = {
    _id: id,
  };
  if (req?.user?.role !== ENUM_USER_ROLE.ADMIN) {
    quary.userId = req?.user?._id;
  }
  const result = await RunContest.findOneAndUpdate(quary, payload, {
    new: true,
  });
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
