/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from 'http-status';
import { SortOrder } from 'mongoose';
import { paginationHelper } from '../../../helper/paginationHelper';
import ApiError from '../../errors/ApiError';
import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';
import { IGeneralUser, IGeneralUserFilters } from './interface.GeneralUser';
import { GeneralUserSearchableFields } from './constant.GeneralUser';
import { GeneralUser } from './model.GeneralUser';

const createGeneralUserByFirebaseFromDb = async (
  payload: IGeneralUser
): Promise<IGeneralUser | null> => {
  let result = null;
  result = await GeneralUser.findOne({ uid: payload?.uid });
  if (!result) {
    result = await GeneralUser.create(payload);
  }
  return result;
};

const getAllGeneralUsersFromDb = async (
  filters: IGeneralUserFilters,
  paginationOptions: IPaginationOption
): Promise<IGenericResponse<IGeneralUser[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: GeneralUserSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await GeneralUser.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await GeneralUser.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleGeneralUserFromDb = async (
  id: string
): Promise<IGeneralUser | null> => {
  const result = await GeneralUser.findOne({ id });
  return result;
};

// module 15 --> 14,15 vedio
const updateGeneralUserFromDb = async (
  id: string,
  payload: Partial<IGeneralUser>
): Promise<IGeneralUser | null> => {
  const isExist = await GeneralUser.findOne({ id });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'GeneralUser not found !');
  }

  const { ...GeneralUserData } = payload;

  const updatedGeneralUserData: Partial<IGeneralUser> = { ...GeneralUserData };

  const result = await GeneralUser.findOneAndUpdate(
    { id },
    updatedGeneralUserData,
    {
      new: true,
    }
  );
  return result;
};

const deleteGeneralUserFromDb = async (
  id: string
): Promise<IGeneralUser | null> => {
  const result = await GeneralUser.findByIdAndDelete(id);
  return result;
};

export const GeneralUserService = {
  createGeneralUserByFirebaseFromDb,
  getAllGeneralUsersFromDb,
  getSingleGeneralUserFromDb,
  updateGeneralUserFromDb,
  deleteGeneralUserFromDb,
};
