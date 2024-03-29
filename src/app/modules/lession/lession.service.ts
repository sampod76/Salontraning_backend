import { SortOrder, Types } from 'mongoose';
import { paginationHelper } from '../../../helper/paginationHelper';

import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';
import { LESSION_SEARCHABLE_FIELDS } from './lession.consent';
import { ILession, ILessionFilters } from './lession.interface';
import { Lession } from './lession.model';
import { generateLessionId } from './lession.utils';

const createLessionByDb = async (
  payload: ILession
): Promise<ILession | null> => {
  payload.lessionId = await generateLessionId(payload.courseId);
  const result = await Lession.create(payload);
  // .populate({
  //   path: 'course',
  //   // select: { needsPasswordChange: 0, createdAt: 0, updatedAt: 0, __v: 0 },
  //   // populate: [
  //   //   {
  //   //     path: 'moderator',
  //   //     select: { createdAt: 0, updatedAt: 0, __v: 0 },
  //   //   }
  //   // ],
  // });
  return result;
};

//getAllLessionFromDb
const getAllLessionFromDb = async (
  filters: ILessionFilters,
  paginationOptions: IPaginationOption
): Promise<IGenericResponse<ILession[]>> => {
  //****************search and filters start************/

  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: LESSION_SEARCHABLE_FIELDS.map(field =>
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
      $and: Object.entries(filtersData).map(([field, value]) =>
        field === 'course'
          ? { [field]: new Types.ObjectId(value) }
          : {
              [field]: value,
            }
      ),
    });
  }
  console.log(filtersData);

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

  const result = await Lession.find(whereConditions)
    .populate('course', 'courseId title publisherName')
    .populate('thumbnail')
    .sort(sortConditions)
    .skip(Number(skip))
    .limit(Number(limit));

  const total = await Lession.countDocuments(whereConditions);
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
const getSingleLessionFromDb = async (id: string): Promise<ILession | null> => {
  const result = await Lession.findById(id)
    .populate('course', 'courseId title publisherName')
    .populate('thumbnail');

  return result;
};

// update e form db
const updateLessionFromDb = async (
  id: string,
  payload: Partial<ILession>
): Promise<ILession | null> => {
  console.log(payload);
  const result = await Lession.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

// delete e form db
const deleteLessionByIdFromDb = async (
  id: string
): Promise<ILession | null> => {
  const result = await Lession.findByIdAndDelete(id);
  return result;
};

export const LessionService = {
  createLessionByDb,
  getAllLessionFromDb,
  getSingleLessionFromDb,
  updateLessionFromDb,
  deleteLessionByIdFromDb,
};
