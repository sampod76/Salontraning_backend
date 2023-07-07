import mongoose, { PipelineStage, Types } from 'mongoose';

import { paginationHelper } from '../../../helper/paginationHelper';

import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';

import ApiError from '../../errors/ApiError';
import { COURSE_SEARCHABLE_FIELDS } from './course.consent';
import { ICourse, ICourseFilters } from './course.interface';
import { Course } from './course.model';
import { generateCourseId } from './course.utils';
const { ObjectId } = mongoose.Types;
const createCourseByDb = async (payload: ICourse): Promise<ICourse> => {
  payload.courseId = await generateCourseId();
  const result = (await Course.create(payload)).populate([
    {
      path: 'publisher',
      select: {
        needsPasswordChange: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      },
      // populate: [
      //   {
      //     path: 'moderator',
      //     select: { createdAt: 0, updatedAt: 0, __v: 0 },
      //   },
      //   {
      //     path: 'admin',
      //     select: { createdAt: 0, updatedAt: 0, __v: 0 },
      //   },
      // ],
    },
  ]);
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
      $or: COURSE_SEARCHABLE_FIELDS.map(field =>
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
        field === 'price'
          ? { [field]: { $gte: parseInt(value as string) } }
          : {
              [field]: value,
            }
      ),
    });
  }

  //****************search and filters end**********/

  //****************pagination start **************/

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: 1 | -1 } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder === 'asc' ? 1 : -1;
  }

  //****************pagination end ***************/

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  /* 
  const result = await Course.find(whereConditions)
    .sort(sortConditions)
    .skip(Number(skip))
    .limit(Number(limit)); 
  */
  const pipeline: PipelineStage[] = [
    { $match: whereConditions },

    {
      $lookup: {
        from: 'moderators',
        let: { id: '$publisher' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$_id', '$$id'] },
              // Additional filter conditions for collection2
            },
          },
          // Additional stages for collection2
          // প্রথম লুকাপ চালানোর পরে যে ডাটা আসছে তার উপরে যদি আমি যেই কোন কিছু করতে চাই তাহলে এখানে করতে হবে |যেমন আমি এখানে project করেছি
          {
            $project: {
              _id: 1,
              name: 1,
              profileImage: 1,
            },
          },
        ],
        as: 'publisherDetails',
      },
    },
    {
      $lookup: {
        from: 'fileuploades',
        let: { conditionField: '$thumbnail' }, // The field to match from the current collection
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', '$$conditionField'], // The condition to match the fields
              },
            },
          },

          // Additional pipeline stages for the second collection (optional)
          {
            $project: {
              createdAt: 0,
              updatedAt: 0,
              userId: 0,
            },
          },
          {
            $addFields: {
              link: {
                $concat: [
                  process.env.REAL_HOST_SERVER_SIDE,
                  '/',
                  'images',
                  '/',
                  '$filename',
                ],
              },
            },
          },
        ],
        as: 'thumbnailInfo', // The field to store the matched results from the second collection
      },
    },

    {
      $project: { thumbnail: 0 },
    },
    {
      $addFields: {
        thumbnail: '$thumbnailInfo',
      },
    },
    {
      $project: {
        thumbnailInfo: 0,
      },
    },
    {
      $unwind: '$thumbnail',
    },
    { $sort: sortConditions },
    { $skip: Number(skip) || 0 },
    { $limit: Number(limit) || 15 },
  ];

  const result = await Course.aggregate(pipeline);

  const total = await Course.countDocuments(whereConditions);
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
const getSingleCourseFromDb = async (id: string): Promise<ICourse | null> => {
  const result = await Course.aggregate([
    { $match: { _id: new ObjectId(id) } },
    {
      $lookup: {
        from: 'lessions',
        let: { id: '$_id' }, // The field to match from the current collection
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$course', '$$id'], // The condition to match the fields
              },
            },
          },
          { $sort: { serial_no: 1 } },
          // Additional pipeline stages for the second collection (optional)
          {
            $project: {
              vedio: 0,
              createdAt: 0,
              updatedAt: 0,
              tag: 0,
              description: 0,
            },
          },
        ],
        as: 'All_lessions', // The field to store the matched results from the second collection
      },
    },
    // {
    //   $lookup: {
    //     from: 'quizzes',
    //     localField: 'courseId',
    //     foreignField: 'courseId',
    //     as: 'quizzes',
    //   },
    // },

    {
      $lookup: {
        from: 'fileuploades',
        let: { conditionField: '$thumbnail' }, // The field to match from the current collection
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', '$$conditionField'], // The condition to match the fields
              },
            },
          },

          // Additional pipeline stages for the second collection (optional)
          {
            $project: {
              createdAt: 0,
              updatedAt: 0,
              userId: 0,
            },
          },
          {
            $addFields: {
              link: {
                $concat: [
                  process.env.REAL_HOST_SERVER_SIDE,
                  '/',
                  'images',
                  '/',
                  '$filename',
                ],
              },
            },
          },
        ],
        as: 'thumbnailInfo', // The field to store the matched results from the second collection
      },
    },

    {
      $project: { thumbnail: 0 },
    },
    {
      $addFields: {
        thumbnail: '$thumbnailInfo',
      },
    },
    {
      $project: {
        thumbnailInfo: 0,
      },
    },
    {
      $unwind: '$thumbnail',
    },
  ]);

  return result[0];
};

// update e form db
const updateCourseFromDb = async (
  id: string,
  payload: Partial<ICourse>
): Promise<ICourse | null> => {
  const { publish, ...otherData } = payload;
  const updateData = { ...otherData };

  if (publish && Object.keys(publish).length > 0) {
    Object.keys(publish).forEach(key => {
      const publishKey = `publish.${key}`; // `publish.status`
      (updateData as any)[publishKey] = publish[key as keyof typeof publish];
    });
  }
  const result = await Course.findOneAndUpdate({ _id: id }, updateData, {
    new: true,
  });
  return result;
};

// delete e form db
const deleteCourseByIdFromDb = async (id: string): Promise<ICourse | null> => {
  const result = await Course.findByIdAndDelete(id);
  return result;
};

// set user reviews e form db
const courseReviewsByUserFromDb = async (
  id: string,
  payload: Partial<ICourse>,
  req: any
): Promise<ICourse | null> => {
  const { reviews } = payload;

  const result = await Course.findOneAndUpdate(
    { _id: id, 'reviews.userId': { $ne: new Types.ObjectId(req?.user?._id) } },
    {
      $push: {
        reviews: { ...reviews, userId: req?.user?._id },
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!result) {
    throw new ApiError(404, 'You cannot send review');
  }
  return result;
};

export const CourseService = {
  createCourseByDb,
  getAllCourseFromDb,
  getSingleCourseFromDb,
  updateCourseFromDb,
  deleteCourseByIdFromDb,
  courseReviewsByUserFromDb,
};
