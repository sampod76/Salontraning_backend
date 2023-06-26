import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { PAGINATION_FIELDS } from '../../../constant/pagination';
import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';
import { moderatorFilterableFields } from './moderator.constant';
import { IModerator } from './moderator.interface';
import { ModeratorService } from './moderator.service';

const getAllModerators = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, moderatorFilterableFields);
  const paginationOptions = pick(req.query, PAGINATION_FIELDS);

  const result = await ModeratorService.getAllModeratorsFromDb(
    filters,
    paginationOptions
  );

  sendResponse<IModerator[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Moderator retrieved successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleModerator = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await ModeratorService.getSingleModeratorFromDb(id);

  sendResponse<IModerator>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Moderator retrieved successfully !',
    data: result,
  });
});

const updateModerator = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;
  const result = await ModeratorService.updateModeratorFromDb(id, updatedData);

  sendResponse<IModerator>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Moderator updated successfully !',
    data: result,
  });
});

const deleteModerator = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await ModeratorService.deleteModeratorFromDb(id);

  sendResponse<IModerator>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Moderator deleted successfully !',
    data: result,
  });
});

export const ModeratorController = {
  getAllModerators,
  getSingleModerator,
  updateModerator,
  deleteModerator,
};