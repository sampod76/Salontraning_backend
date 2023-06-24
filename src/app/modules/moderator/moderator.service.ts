/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-dgetAllModeratorisable @typescript-eslint/no-explicit-any */
import mongoose, { SortOrder } from 'mongoose';

import httpStatus from 'http-status';

import { paginationHelper } from '../../../helper/paginationHelper';
import ApiError from '../../errors/ApiError';
import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';
import { User } from '../users/users.model';
import { IModerator, IModeratorFilters } from './moderator.interface';
import { moderatorSearchableFields } from './moderator.constant';
import { Moderator } from './moderator.model';

const getAllModeratorsFromDb = async (
  filters: IModeratorFilters,
  paginationOptions: IPaginationOption
): Promise<IGenericResponse<IModerator[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: moderatorSearchableFields.map(field => ({
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

  const result = await Moderator.find(whereConditions)

    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Moderator.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleModeratorFromDb = async (
  id: string
): Promise<IModerator | null> => {
  const result = await Moderator.findOne({ id });

  return result;
};

const updateModeratorFromDb = async (
  id: string,
  payload: Partial<IModerator>
): Promise<IModerator | null> => {
  const isExist = await Moderator.findOne({ id });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Moderator not found !');
  }

  const { name, ...ModeratorData } = payload;
  const updatedModeratorData: Partial<IModerator> = { ...ModeratorData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IModerator>;
      (updatedModeratorData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await Moderator.findOneAndUpdate(
    { id },
    updatedModeratorData,
    {
      new: true,
    }
  );
  return result;
};

const deleteModeratorFromDb = async (
  id: string
): Promise<IModerator | null> => {
  // check if the Moderator is exist
  const isExist = await Moderator.findOne({ id });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Moderator not found !');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //delete Moderator first
    const result = await Moderator.findOneAndDelete({ id }, { session });
    if (!result) {
      throw new ApiError(404, 'Failed to delete student');
    }
    //delete user
    await User.deleteOne({ id });
    session.commitTransaction();
    session.endSession();

    return result;
  } catch (error) {
    session.abortTransaction();
    throw error;
  }
};

export const ModeratorService = {
  getAllModeratorsFromDb,
  getSingleModeratorFromDb,
  updateModeratorFromDb,
  deleteModeratorFromDb,
};
