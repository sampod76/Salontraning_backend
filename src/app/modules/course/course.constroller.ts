import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constant/pagination';
// import { globalImport } from '../../../import/global_Import';
// import ApiError from '../../errors/ApiError';
import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';
import { COURSE_FILTERABLE_FIELDS } from './course.consent';
import { ICourse } from './course.interface';
import { CourseService } from './course.service';

// import { z } from 'zod'
const createCourse = catchAsync(async (req: Request, res: Response) => {
  const { ...courseData } = req.body;

  const result = await CourseService.createCourseByDb(courseData);

  sendResponse<ICourse>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull create academic Course',
    data: result,
  });
  // next();
  /* res.status(200).send({
      success: true,
      data: result,
      message: 'successfull create academic Course',
    }); */
});

const getAllCourse = catchAsync(async (req: Request, res: Response) => {
  //****************search and filter start******* */
  const filters = pick(req.query, COURSE_FILTERABLE_FIELDS);

  //****************pagination start************ */

  const paginationOptions = pick(req.query, PAGINATION_FIELDS);

  const result = await CourseService.getAllCourseFromDb(
    filters,
    paginationOptions
  );

  sendResponse<ICourse[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull Get academic Course',
    meta: result.meta,
    data: result.data,
  });
  // next();
});

const getSingleCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CourseService.getSingleCourseFromDb(id);
  sendResponse<ICourse>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull get academic Course',
    data: result,
  });
});
const updateCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  const result = await CourseService.updateCourseFromDb(id, updateData);

  sendResponse<ICourse>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull update academic Course',
    data: result,
  });
});

const deleteCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CourseService.deleteCourseByIdFromDb(id);
  sendResponse<ICourse>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull delete academic Course',
    data: result,
  });
});
export const CourseController = {
  createCourse,
  getAllCourse,
  getSingleCourse,
  updateCourse,
  deleteCourse,
};
