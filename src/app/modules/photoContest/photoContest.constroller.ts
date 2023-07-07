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
    const result = await PhotoContestUserService.createPhotoContestUserByDb({
      ...req.body,
      // userId: req?.user?._id,
    });

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
    let queryObject = req.query;
    queryObject = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(queryObject).filter(([_, value]) => Boolean(value))
    );
    const filters = pick(queryObject, PHOTOCONTEST_USER_FILTERABLE_FIELDS);

    //****************pagination start************ */

    const paginationOptions = pick(queryObject, PAGINATION_FIELDS);

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
      await PhotoContestUserService.getSinglePhotoContestUserFromDb(id, req);
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
const voteMassageSharePhotoContestUser = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result =
      await PhotoContestUserService.voteMassageSharePhotoContestUserFromDb(
        id,
        req,
        updateData
      );

    sendResponse<IPhotoContestUser>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull submit',
      // data: result,
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
  voteMassageSharePhotoContestUser,
};
