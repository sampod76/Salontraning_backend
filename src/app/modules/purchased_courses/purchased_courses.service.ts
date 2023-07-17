import mongoose, { SortOrder } from 'mongoose';
import { paginationHelper } from '../../../helper/paginationHelper';

import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';

import { PURCHASED_COURSES_SEARCHABLE_FIELDS } from './purchased_courses.consent';
import {
  IPurchased_courses,
  IPurchased_coursesFilters,
} from './purchased_courses.interface';
import { Purchased_courses } from './purchased_courses.model';

import ApiError from '../../errors/ApiError';
import { GeneralUser } from '../generalUser/model.GeneralUser';
const { ObjectId } = mongoose.Types;

//
const createPurchased_coursesByDb = async (
  payload: IPurchased_courses | any,
  userId: string
): Promise<IPurchased_courses | null> => {
  // let newCoursePurchase = null;
  // const session = await mongoose.startSession();
  // try {
  //   session.startTransaction();
  const addCourseByUser = await GeneralUser.updateOne(
    {
      _id: new ObjectId(userId),
      'purchase_courses.course': { $ne: payload.course },
    },
    {
      $push: {
        purchase_courses: { course: payload.course } /* course --> _id */,
      },
    },
    { /* session, */ new: true, runValidators: true }
  );

  if (!addCourseByUser.modifiedCount) {
    throw new ApiError(404, 'Failed to by course');
  }

  // payload.transactionID = payload.transactionID
  //   ? payload.courseId + '-' + payload.transactionID
  //   : payload.courseId + '-' + Math.random().toString(16).slice(2);

  // const createPurchase = await Purchased_courses.create([payload], {
  //   session,
  // });
  const createPurchase = await Purchased_courses.create(payload);

  if (!createPurchase) {
    throw new ApiError(404, 'Failed to by course');
  }

  //   newCoursePurchase = createPurchase[0]._id ? createPurchase[0] : null;
  //   session.commitTransaction();
  //   session.endSession();
  // } catch (error) {
  //   await session.abortTransaction();
  //   await session.endSession();
  //   throw error;
  // }

  // if (newCoursePurchase?._id) {
  //   newCoursePurchase = await Purchased_courses.findById(
  //     newCoursePurchase?._id
  //   ).populate('course');
  // }

  return createPurchase;
};

//getAllPurchased_coursesFromDb
const getAllPurchased_coursesFromDb = async (
  filters: IPurchased_coursesFilters,
  paginationOptions: IPaginationOption
): Promise<IGenericResponse<IPurchased_courses[]>> => {
  //****************search and filters start************/
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: PURCHASED_COURSES_SEARCHABLE_FIELDS.map(field => ({
        [field]: new RegExp(searchTerm, 'i'),
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

  const result = await Purchased_courses.find(whereConditions)
    .sort(sortConditions)
    .skip(Number(skip))
    .limit(Number(limit));

  const total = await Purchased_courses.countDocuments(whereConditions);
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
const getSinglePurchased_coursesFromDb = async (
  id: string
): Promise<IPurchased_courses | null> => {
  const result = await Purchased_courses.findById(id);
  return result;
};

// update e form db
const updatePurchased_coursesFromDb = async (
  id: string,
  payload: Partial<IPurchased_courses>
): Promise<IPurchased_courses | null> => {
  const result = await Purchased_courses.findOneAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
      runValidators: true,
    }
  );
  return result;
};

// delete e form db
const deletePurchased_coursesByIdFromDb = async (
  id: string
): Promise<IPurchased_courses | null> => {
  const result = await Purchased_courses.findByIdAndDelete(id);
  return result;
};

export const Purchased_coursesService = {
  createPurchased_coursesByDb,
  getAllPurchased_coursesFromDb,
  getSinglePurchased_coursesFromDb,
  updatePurchased_coursesFromDb,
  deletePurchased_coursesByIdFromDb,
};

//suport session to solve

// const createPurchased_coursesByDb = async (
//   payload: IPurchased_courses,
//   userId: string
// ): Promise<IPurchased_courses | null> => {
//   let newCoursePurchase = null;
//   const session = await mongoose.startSession();
//   try {
//     session.startTransaction();
//     const addCourseByUser = await GeneralUser.updateOne(
//       {
//         _id: new ObjectId(userId),
//         'purchase_courses.course': { $ne: payload.course },
//       },
//       {
//         $push: {
//           purchase_courses: { course: payload.course } /* course --> _id */,
//         },
//       },
//       { session, new: true, runValidators: true }
//     );

//     if (!addCourseByUser.modifiedCount) {
//       throw new ApiError(404, 'Failed to by course');
//     }

//     // payload.transactionID = payload.transactionID
//     //   ? payload.courseId + '-' + payload.transactionID
//     //   : payload.courseId + '-' + Math.random().toString(16).slice(2);

//     const createPurchase = await Purchased_courses.create([payload], {
//       session,
//     });

//     if (createPurchase.length === 0) {
//       throw new ApiError(404, 'Failed to by course');
//     }

//     newCoursePurchase = createPurchase[0]._id ? createPurchase[0] : null;
//     session.commitTransaction();
//     session.endSession();
//   } catch (error) {
//     await session.abortTransaction();
//     await session.endSession();
//     throw error;
//   }

//   if (newCoursePurchase?._id) {
//     newCoursePurchase = await Purchased_courses.findById(
//       newCoursePurchase?._id
//     ).populate('course');
//   }

//   return newCoursePurchase;
// };
