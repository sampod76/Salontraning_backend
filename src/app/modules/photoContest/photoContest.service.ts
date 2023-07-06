import { PipelineStage, Types } from 'mongoose';
import { paginationHelper } from '../../../helper/paginationHelper';

import { Request } from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import ApiError from '../../errors/ApiError';
import { IGenericResponse } from '../../interface/common';
import { IPaginationOption } from '../../interface/pagination';
import { PHOTOCONTEST_USER_SEARCHABLE_FIELDS } from './photoContest.consent';
import {
  IPhotoContestUser,
  IPhotoContestUserFilters,
} from './photoContest.interface';
import { PhotoContestUser } from './photoContest.model';

const createPhotoContestUserByDb = async (
  payload: IPhotoContestUser
): Promise<IPhotoContestUser | null> => {
  const result = (await PhotoContestUser.create(payload)).populate('thumbnail');
  return result;
};

//getAllPhotoContestUserFromDb
const getAllPhotoContestUserFromDb = async (
  filters: IPhotoContestUserFilters,
  paginationOptions: IPaginationOption
): Promise<IGenericResponse<IPhotoContestUser[]>> => {
  //****************search and filters start************/
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: PHOTOCONTEST_USER_SEARCHABLE_FIELDS.map(field =>
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
      $and: Object.entries(filtersData).map(([field, value]) =>
        field === 'contest'
          ? { [field]: new Types.ObjectId(value) }
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

  // must be alltime add ---> loveReact_count: -1
  const sortConditions: { [key: string]: 1 | -1 } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder === 'asc' ? 1 : -1;
  }

  //****************pagination end ***************/

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  // const result = await PhotoContestUser.find(whereConditions)
  //   .sort(sortConditions)
  //   .skip(Number(skip))
  //   .limit(Number(limit));

  const pipeline: PipelineStage[] = [
    { $match: whereConditions },

    // thumbnail to same thumbnail images
    {
      $lookup: {
        from: 'fileuploades',
        let: { id: '$thumbnail' },
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
              mimetype: 0,
              updatedAt: 0,
              path: 0,
              userId: 0,
            },
          },
        ],
        as: 'thumbnailInfo',
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
      $project: { thumbnailInfo: 0 },
    },
    {
      $unwind: '$thumbnail',
    },

    {
      $addFields: {
        loveReacts_count: { $size: { $ifNull: ['$loveReacts', []] } },
      },
    },
    {
      $addFields: {
        messages_count: { $size: { $ifNull: ['$messages', []] } },
      },
    },
    {
      $addFields: {
        share_count: { $size: { $ifNull: ['$share', []] } },
      },
    },
    {
      $project: { share: 0, loveReacts: 0, messages: 0 },
    },
    { $sort: sortConditions },
    { $skip: Number(skip) || 0 },
    { $limit: Number(limit) || 15 },
  ];

  const result = await PhotoContestUser.aggregate(pipeline);

  const total = await PhotoContestUser.countDocuments(whereConditions);
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
const getSinglePhotoContestUserFromDb = async (
  id: string
): Promise<IPhotoContestUser | null> => {
  const result = await PhotoContestUser.findById(id)

    .populate({
      path: 'thumbnail',
      select: 'title size filename category',
    })
    .populate({
      path: 'contest',
      select: { title: 1, status: 1, duration_time: 1, contestId: 1 },
    })
    .populate({
      path: 'userId',
      select: { name: 1, email: 1, phone: 1 },
    });
  return result;
};

// update e form db
const updatePhotoContestUserFromDb = async (
  id: string,
  req: Request,
  payload: Partial<IPhotoContestUser>
): Promise<IPhotoContestUser | null> => {
  const quary: { userId?: string; _id: string } = {
    _id: id,
  };
  if (req?.user?.role !== ENUM_USER_ROLE.ADMIN) {
    quary.userId = req?.user?._id;
  }

  const result = await PhotoContestUser.findOneAndUpdate(quary, payload, {
    new: true,
    runValidators: true,
  });
  if (!result) {
    throw new ApiError(505, 'The operation failed');
  }
  return result;
};

const voteMassageSharePhotoContestUserFromDb = async (
  id: string, //docoment id --> photocontest id
  req: Request,
  payload: Partial<{ loveReact: string; message: string; share: string }>
): Promise<IPhotoContestUser | null> => {
  console.log(payload);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { loveReact, message, share } = payload;
  let quary: any = {
    _id: id,
  };

  const updateData = {};
  if (loveReact === 'yes') {
    quary = {
      ...quary,
      loveReacts: { $nin: new Types.ObjectId(req?.user?._id) },
    };
    (updateData as any)['$push'] = {
      loveReacts: req?.user?._id,
    };
  } else if (loveReact === 'no') {
    quary = {
      ...quary,
      loveReacts: { $in: new Types.ObjectId(req?.user?._id) },
    };
    (updateData as any)['$pull'] = {
      loveReacts: req?.user?._id,
    };
  }

  // if (loveReact) {
  //   quary = {
  //     ...quary,
  //     loveReacts: { $nin: new Types.ObjectId(req?.user?._id) },
  //   };
  //   (updateData as any)['$push'] = {
  //     loveReacts: loveReact,
  //   };
  // }

  if (message) {
    quary = {
      ...quary,
      'messages.userId': { $ne: new Types.ObjectId(req?.user?._id) },
    };
    (updateData as any)['$push'] = {
      messages: {
        userId: req?.user?._id,
        message,
      },
    };
  }

  if (share === 'yes') {
    quary = {
      ...quary,
      share: { $nin: new Types.ObjectId(req?.user?._id) },
    };
    (updateData as any)['$push'] = {
      share: req?.user?._id,
    };
  } else if (share === 'no') {
    quary = {
      ...quary,
      share: { $in: new Types.ObjectId(req?.user?._id) },
    };
    (updateData as any)['$pull'] = {
      share: req?.user?._id,
    };
  }

  const result = await PhotoContestUser.findOneAndUpdate(quary, updateData, {
    new: true,
    runValidators: true,
  });
  if (!result) {
    throw new ApiError(505, 'Your are allrady done that !!!');
  }
  return result;
};

// delete e form db
const deletePhotoContestUserByIdFromDb = async (
  id: string,
  req: Request
): Promise<IPhotoContestUser | null> => {
  const quary: { userId?: string; _id: string } = {
    _id: id,
  };
  if (req?.user?.role !== ENUM_USER_ROLE.ADMIN) {
    quary.userId = req?.user?._id;
  }
  const result = await PhotoContestUser.findOneAndDelete(quary);
  if (!result) {
    throw new ApiError(505, 'The operation failed');
  }
  return result;
};

export const PhotoContestUserService = {
  createPhotoContestUserByDb,
  getAllPhotoContestUserFromDb,
  getSinglePhotoContestUserFromDb,
  updatePhotoContestUserFromDb,
  deletePhotoContestUserByIdFromDb,
  voteMassageSharePhotoContestUserFromDb,
};
