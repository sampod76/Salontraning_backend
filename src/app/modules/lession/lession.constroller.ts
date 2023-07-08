import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constant/pagination';
// import { globalImport } from '../../../import/global_Import';
// import ApiError from '../../errors/ApiError';
import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';
import { LESSION_FILTERABLE_FIELDS } from './lession.consent';
import { ILession } from './lession.interface';
import { LessionService } from './lession.service';

// import { z } from 'zod'
const createLession = catchAsync(async (req: Request, res: Response) => {
  const { ...LessionData } = req.body;

  const result = await LessionService.createLessionByDb(LessionData);

  sendResponse<ILession>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull create  Lession',
    data: result,
  });
});

const getAllLession = catchAsync(async (req: Request, res: Response) => {
  //****************search and filter start******* */
  let queryObject = req.query;
  queryObject = Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(queryObject).filter(([_, value]) => Boolean(value))
  );
  const filters = pick(queryObject, LESSION_FILTERABLE_FIELDS);

  //****************pagination start************ */

  const paginationOptions = pick(queryObject, PAGINATION_FIELDS);

  const result = await LessionService.getAllLessionFromDb(
    filters,
    paginationOptions
  );

  sendResponse<ILession[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull found Lessions',
    meta: result.meta,
    data: result.data,
  });
  // next();
});

const getSingleLession = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await LessionService.getSingleLessionFromDb(id);
  sendResponse<ILession>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull get Lession',
    data: result,
  });
});
const updateLession = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  const result = await LessionService.updateLessionFromDb(id, updateData);

  sendResponse<ILession>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull update Lession',
    data: result,
  });
});

const deleteLession = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await LessionService.deleteLessionByIdFromDb(id);
  sendResponse<ILession>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull delete Lession',
    data: result,
  });
});
export const LessionController = {
  createLession,
  getAllLession,
  getSingleLession,
  updateLession,
  deleteLession,
};
