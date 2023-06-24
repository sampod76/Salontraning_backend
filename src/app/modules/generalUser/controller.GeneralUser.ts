import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constant/pagination';
import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';
import { GeneralUserFilterableFields } from './constant.GeneralUser';
import { IGeneralUser } from './interface.GeneralUser';
import { GeneralUserService } from './service.GeneralUser';
import config from '../../../config';
import { jwtHelpers } from '../../../helper/jwtHelpers';
import { Secret } from 'jsonwebtoken';
import ApiError from '../../errors/ApiError';

const getAllGeneralUsers = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, GeneralUserFilterableFields);
  const paginationOptions = pick(req.query, PAGINATION_FIELDS);

  const result = await GeneralUserService.getAllGeneralUsersFromDb(
    filter,
    paginationOptions
  );
  sendResponse<IGeneralUser[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'users found successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const createGeneralUserByFirebase = catchAsync(
  async (req: Request, res: Response) => {
    const result = await GeneralUserService.createGeneralUserByFirebaseFromDb(
      req.body
    );
    if (!result) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'forbidden access!');
    }
    const refreshToken = jwtHelpers.createToken(
      { uid: result?.uid, role: result?.role },
      config.jwt.refresh_secret as Secret,
      config.jwt.refresh_expires_in as string
    );
    const accessToken = jwtHelpers.createToken(
      { uid: result?.uid, role: result?.role },
      config.jwt.secret as Secret,
      config.jwt.expires_in as string
    );
    const cookieOptions = {
      // secure: config.env === 'production' ? true :false,
      //same
      secure: config.env === 'production',
      httpOnly: true,
    };
    //এটার মাধ্যমে ক্লাইন সাইডে আমার পাঠানো রেসপন্স এর বাইরেও অটোমেটিকলি সে এই cookie সেট করে দেবে
    res.cookie('refreshToken', refreshToken, cookieOptions);
    res.cookie('accessToken', accessToken, cookieOptions);

    sendResponse<IGeneralUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'user found successfully !',
      data: result,
    });
  }
);

const getSingleGeneralUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await GeneralUserService.getSingleGeneralUserFromDb(id);
  sendResponse<IGeneralUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user found successfully !',
    data: result,
  });
});

const updateGeneralUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;

  const result = await GeneralUserService.updateGeneralUserFromDb(
    id,
    updatedData
  );

  sendResponse<IGeneralUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user updated successfully !',
    data: result,
  });
});

const deleteGeneralUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await GeneralUserService.deleteGeneralUserFromDb(id);

  sendResponse<IGeneralUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user deleted successfully !',
    data: result,
  });
});

export const GeneralUserController = {
  createGeneralUserByFirebase,
  getAllGeneralUsers,
  getSingleGeneralUser,
  updateGeneralUser,
  deleteGeneralUser,
};
