import { SortOrder } from 'mongoose';
import { paginationHelper } from '../../../helper/paginationHelper';

import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';

import { COURSE_SEARCHABLE_FIELDS } from './course.consent';
import { ICourse, ICourseFilters } from './course.interface';
import { Course } from './course.model';
import { generateCourseId } from './course.utils';

const createCourseByDb = async (payload: ICourse): Promise<ICourse> => {
  payload.courseId = await generateCourseId();
  const result = (await Course.create(payload)).populate({
    path: 'publisher',
    select: { needsPasswordChange: 0, createdAt: 0, updatedAt: 0, __v: 0 },
    populate: [
      {
        path: 'moderator',
        select: { createdAt: 0, updatedAt: 0, __v: 0 },
      },
      {
        path: 'admin',
        select: { createdAt: 0, updatedAt: 0, __v: 0 },
      },
    ],
  });
  return result;
};

//getAllCourseFromDb
const getAllCourseFromDb = async (
  filters: ICourseFilters,
  paginationOptions: IPaginationOption
): Promise<IGenericResponse<ICourse[]>> => {
  //****************search and filters start************/
  const { searchTerm, ...filtersData } = filters;
  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: COURSE_SEARCHABLE_FIELDS.map(field => ({
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

  const result = await Course.find(whereConditions)
    .sort(sortConditions)
    .skip(Number(skip))
    .limit(Number(limit));

  const total = await Course.countDocuments();
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
const getSignleCourseFromDb = async (id: string): Promise<ICourse | null> => {
  const result = await Course.findById(id);
  return result;
};

// update e form db
const updateCourseFromDb = async (
  id: string,
  payload: Partial<ICourse>
): Promise<ICourse | null> => {
  const result = await Course.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

// delete e form db
const deleteCourseByIdFromDb = async (id: string): Promise<ICourse | null> => {
  const result = await Course.findByIdAndDelete(id);
  return result;
};

export const CourseService = {
  createCourseByDb,
  getAllCourseFromDb,
  getSignleCourseFromDb,
  updateCourseFromDb,
  deleteCourseByIdFromDb,
};
