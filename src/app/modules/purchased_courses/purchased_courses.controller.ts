import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constant/pagination';
// import { globalImport } from '../../../import/global_Import';
// import ApiError from '../../errors/ApiError';
import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';
import { PURCHASED_COURSES_FILTERABLE_FIELDS } from './purchased_courses.consent';
import { IPurchased_courses } from './purchased_courses.interface';
import { Purchased_coursesService } from './purchased_courses.service';

// import { z } from 'zod'
const createPurchased_courses = catchAsync(
  async (req: Request, res: Response) => {
    const { ...Purchased_coursesData } = req.body;
    const userId = Purchased_coursesData?.userId;
    const result = await Purchased_coursesService.createPurchased_coursesByDb(
      Purchased_coursesData,
      userId
    );
    console.log(result);
    sendResponse<IPurchased_courses>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull create  Purchased_courses',
      data: result,
    });
    // next();
    /* res.status(200).send({
      success: true,
      data: result,
      message: 'successfull create  Purchased_courses',
    }); */
  }
);

const getAllPurchased_courses = catchAsync(
  async (req: Request, res: Response) => {
    //****************search and filter start******* */
    const filters = pick(req.query, PURCHASED_COURSES_FILTERABLE_FIELDS);

    //****************pagination start************ */

    const paginationOptions = pick(req.query, PAGINATION_FIELDS);

    const result = await Purchased_coursesService.getAllPurchased_coursesFromDb(
      filters,
      paginationOptions
    );

    sendResponse<IPurchased_courses[]>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull found Purchased_coursess',
      meta: result.meta,
      data: result.data,
    });
    // next();
  }
);

const getSinglePurchased_courses = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await Purchased_coursesService.getSinglePurchased_coursesFromDb(id);
    sendResponse<IPurchased_courses>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull get Purchased_courses',
      data: result,
    });
  }
);
const updatePurchased_courses = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    const result = await Purchased_coursesService.updatePurchased_coursesFromDb(
      id,
      updateData
    );

    sendResponse<IPurchased_courses>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull update Purchased_courses',
      data: result,
    });
  }
);

const deletePurchased_courses = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await Purchased_coursesService.deletePurchased_coursesByIdFromDb(id);
    sendResponse<IPurchased_courses>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull delete Purchased_courses',
      data: result,
    });
  }
);
export const Purchased_coursesController = {
  createPurchased_courses,
  getAllPurchased_courses,
  getSinglePurchased_courses,
  updatePurchased_courses,
  deletePurchased_courses,
};
