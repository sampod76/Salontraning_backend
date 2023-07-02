/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from 'http-status';
import { SortOrder } from 'mongoose';
import { paginationHelper } from '../../../helper/paginationHelper';
import ApiError from '../../errors/ApiError';
import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';
import { GeneralUserSearchableFields } from './constant.GeneralUser';
import { IGeneralUser, IGeneralUserFilters } from './interface.GeneralUser';
import { GeneralUser } from './model.GeneralUser';
// import { IPurchased_courses } from '../purchased_courses/purchased_courses.interface';
// const {ObjectId}=mongoose.Types

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
  const result = await GeneralUser.findById(id).populate(
    'purchase_courses.course',
    'courseId title thumbnail createdAt'
  );
  return result;
};

// user to course
const getUserToCourseFromDb = async (
  id: string
): Promise<IGeneralUser | null> => {
  const result = await GeneralUser.findById(id).populate(
    'purchase_courses.course'
  );
  return result;
};

// update user course vedio or quiz
const updateCourseVedioOrQuizFromDb = async (
  id: string,
  payload: any
): Promise<IGeneralUser | null> => {
  const { course_id, lessionId, quiz } = payload;
  let result = null;
  if (course_id && lessionId) {
    result = await GeneralUser.findOneAndUpdate(
      {
        _id: id,
        'purchase_courses.course': course_id,
        'purchase_courses.total_completed_lessions': { $ne: lessionId },
      },
      {
        $push: {
          'purchase_courses.$.total_completed_lessions': lessionId,
        },
      },
      {
        new: true,
      }
    );
  }
  if (quiz) {
    result = await GeneralUser.findOneAndUpdate(
      { _id: id, 'purchase_courses.course': course_id },
      {
        $set: {
          'purchase_courses.$.quiz': quiz,
        },
      },
      {
        new: true,
      }
    );
  }

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
  getUserToCourseFromDb,
  updateGeneralUserFromDb,
  updateCourseVedioOrQuizFromDb,
  deleteGeneralUserFromDb,
};
