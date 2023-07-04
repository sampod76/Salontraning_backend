import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constant/pagination';
// import { globalImport } from '../../../import/global_Import';
// import ApiError from '../../errors/ApiError';
import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';
import { PHOTOCONTEST_USER_FILTERABLE_FIELDS } from './photoContest.consent';
import { IPhotoContestUser } from './photoContest.interface';
import { PhotoContestUserService } from './photoContest.service';

// import { z } from 'zod'
const createPhotoContestUser = catchAsync(
  async (req: Request, res: Response) => {
    const { ...PhotoContestUserData } = req.body;

    const result = await PhotoContestUserService.createPhotoContestUserByDb(
      PhotoContestUserData
    );

    sendResponse<IPhotoContestUser>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull create  PhotoContestUser',
      data: result,
    });
    // next();
    /* res.status(200).send({
      success: true,
      data: result,
      message: 'successfull create  PhotoContestUser',
    }); */
  }
);

const getAllPhotoContestUser = catchAsync(
  async (req: Request, res: Response) => {
    //****************search and filter start******* */
    const filters = pick(req.query, PHOTOCONTEST_USER_FILTERABLE_FIELDS);

    //****************pagination start************ */

    const paginationOptions = pick(req.query, PAGINATION_FIELDS);

    const result = await PhotoContestUserService.getAllPhotoContestUserFromDb(
      filters,
      paginationOptions
    );

    sendResponse<IPhotoContestUser[]>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull found PhotoContestUsers',
      meta: result.meta,
      data: result.data,
    });
    // next();
  }
);

const getSinglePhotoContestUser = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await PhotoContestUserService.getSinglePhotoContestUserFromDb(id);
    sendResponse<IPhotoContestUser>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull get PhotoContestUser',
      data: result,
    });
  }
);
const updatePhotoContestUser = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    const result = await PhotoContestUserService.updatePhotoContestUserFromDb(
      id,
      req,
      updateData
    );

    sendResponse<IPhotoContestUser>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull update PhotoContestUser',
      data: result,
    });
  }
);

const deletePhotoContestUser = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await PhotoContestUserService.deletePhotoContestUserByIdFromDb(id, req);
    sendResponse<IPhotoContestUser>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull delete PhotoContestUser',
      data: result,
    });
  }
);
export const PhotoContestUserController = {
  createPhotoContestUser,
  getAllPhotoContestUser,
  getSinglePhotoContestUser,
  updatePhotoContestUser,
  deletePhotoContestUser,
};