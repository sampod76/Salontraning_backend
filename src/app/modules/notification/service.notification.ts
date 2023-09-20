import mongoose, { PipelineStage, Types } from 'mongoose';
import { paginationHelper } from '../../../helper/paginationHelper';

import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';

import { NOTIFICATION_SEARCHABLE_FIELDS } from './consent.notification';
import { INotification, INotificationFilters } from './interface.notification';
import { Notification } from './model.notification';

const createNotificationByDb = async (
  payload: INotification
): Promise<INotification> => {
  const result = (await Notification.create(payload)).populate('thumbnail');
  return result;
};

//getAllNotificationFromDb
const getAllNotificationFromDb = async (
  filters: INotificationFilters,
  paginationOptions: IPaginationOption
): Promise<IGenericResponse<INotification[]>> => {
  //****************search and filters start************/
  const { searchTerm, ...filtersData } = filters;
  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: NOTIFICATION_SEARCHABLE_FIELDS.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) =>
        field === 'userId'
          ? { ['users']: { $in: [new mongoose.Types.ObjectId(value)] } }
          : { [field]: value }
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

  // const result = await Notification.find(whereConditions)
  //   .populate('thumbnail')
  //   .sort(sortConditions)
  //   .skip(Number(skip))
  //   .limit(Number(limit));
  const pipeline: PipelineStage[] = [
    { $match: whereConditions },
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
    //মনে রাখতে হবে যদি এটি দেওয়া না হয় তাহলে সে যখন কোন একটি ক্যাটাগরির থাম্বেল না পাবে সে তাকে দেবে না
    {
      $addFields: {
        thumbnail: {
          $cond: {
            if: { $eq: [{ $size: '$thumbnailInfo' }, 0] },
            then: [{}],
            else: '$thumbnailInfo',
          },
        },
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

  // console.log(pipeline);
  const result = await Notification.aggregate(pipeline);
  // console.log(result, 127);
  const total = await Notification.countDocuments(whereConditions);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// get single Notificatione form db
const getSingleNotificationFromDb = async (
  id: string
): Promise<INotification | null> => {
  const pipeline: PipelineStage[] = [
    { $match: { _id: new Types.ObjectId(id) } },
    ///***************** */ images field ******start
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
    //মনে রাখতে হবে যদি এটি দেওয়া না হয় তাহলে সে যখন কোন একটি ক্যাটাগরির থাম্বেল না পাবে সে তাকে দেবে না
    {
      $addFields: {
        thumbnail: {
          $cond: {
            if: { $eq: [{ $size: '$thumbnailInfo' }, 0] },
            then: [{}],
            else: '$thumbnailInfo',
          },
        },
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
    ///***************** */ images field ******end*********

    ///
  ];

  const result = await Notification.aggregate(pipeline);

  return result[0];
};

// update Notificatione form db
const updateNotificationFromDb = async (
  id: string,
  payload: Partial<INotification>
): Promise<INotification | null> => {
  const result = await Notification.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

// delete Notificatione form db
const deleteNotificationByIdFromDb = async (
  id: string
): Promise<INotification | null> => {
  const result = await Notification.findByIdAndDelete(id).populate('thumbnail');
  return result;
};

export const NotificationService = {
  createNotificationByDb,
  getAllNotificationFromDb,
  getSingleNotificationFromDb,
  updateNotificationFromDb,
  deleteNotificationByIdFromDb,
};
