import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constant/pagination';
// import { globalImport } from '../../../import/global_Import';
// import ApiError from '../../errors/ApiError';
import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';

import { IFileUploade } from './interface.fileUploade';
import { FileUploadeService } from './service.fileUploade';
import { FILEUPLOADE_FILTERABLE_FIELDS } from './consent.fileUploade';

// import { z } from 'zod'
const createFileUploade = catchAsync(async (req: Request, res: Response) => {
  const { ...FileUploadeData } = req.body;
  const result = await FileUploadeService.createFileUploadeByDb(
    FileUploadeData
  );

  sendResponse<IFileUploade>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull create FileUploade FileUploade',
    data: result,
  });
  // next();
  /* res.status(200).send({
      success: true,
      data: result,
      message: 'successfull create FileUploade FileUploade',
    }); */
});

const getAllFileUploade = catchAsync(async (req: Request, res: Response) => {
  //****************search and filter start******* */

  const filters = pick(req.query, FILEUPLOADE_FILTERABLE_FIELDS);

  //****************pagination start************ */

  const paginationOptions = pick(req.query, PAGINATION_FIELDS);

  const result = await FileUploadeService.getAllFileUploadeFromDb(
    filters,
    paginationOptions
  );

  sendResponse<IFileUploade[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull Get FileUploade FileUploade',
    meta: result.meta,
    data: result.data,
  });
  // next();
});

const getSingleFileUploade = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  /*   if (!globalImport.ObjectId.isValid(id)) {
      throw new ApiError(400, 'invalid id sampod');
    } */

  const result = await FileUploadeService.getSingleFileUploadeFromDb(id);

  /* if (!result) {
      throw new ApiError(400, 'No data found');
    } */
  sendResponse<IFileUploade>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull get FileUploade FileUploade',
    data: result,
  });
});
const updateFileUploade = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  /*   if (!globalImport.ObjectId.isValid(id)) {
      throw new ApiError(400, 'invalid id sampod');
    } */

  const result = await FileUploadeService.updateFileUploadeFromDb(
    id,
    updateData
  );

  /* if (!result) {
      throw new ApiError(400, 'No data found');
    } */
  sendResponse<IFileUploade>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull update FileUploade FileUploade',
    data: result,
  });
});

const deleteFileUploade = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await FileUploadeService.deleteFileUploadeByIdFromDb(id);
  sendResponse<IFileUploade>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull delete FileUploade FileUploade',
    data: result,
  });
});
export const FileUploadeController = {
  createFileUploade,
  getAllFileUploade,
  getSingleFileUploade,
  updateFileUploade,
  deleteFileUploade,
};
