import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constant/pagination';
// import { globalImport } from '../../../import/global_Import';
// import ApiError from '../../errors/ApiError';
import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';

import { IRunContest } from './run_contest.interface';
import { RunContestService } from './run_contest.service';
import { RUNCONTEST_FILTERABLE_FIELDS } from './run_contest.consent';

// import { z } from 'zod'
const createRunContest = catchAsync(async (req: Request, res: Response) => {
  const result = await RunContestService.createRunContestByDb({
    ...req.body,
  });

  sendResponse<IRunContest>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull create  RunContest',
    data: result,
  });
  // next();
  /* res.status(200).send({
      success: true,
      data: result,
      message: 'successfull create  RunContest',
    }); */
});

const getAllRunContest = catchAsync(async (req: Request, res: Response) => {
  //****************search and filter start******* */
  let queryObject = req.query;
  queryObject = Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(queryObject).filter(([_, value]) => Boolean(value))
  );
  const filters = pick(queryObject, RUNCONTEST_FILTERABLE_FIELDS);

  //****************pagination start************ */

  const paginationOptions = pick(queryObject, PAGINATION_FIELDS);

  const result = await RunContestService.getAllRunContestFromDb(
    filters,
    paginationOptions
  );

  sendResponse<IRunContest[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull found RunContests',
    meta: result.meta,
    data: result.data,
  });
  // next();
});

const getSingleRunContest = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await RunContestService.getSingleRunContestFromDb(id);
  sendResponse<IRunContest>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull get RunContest',
    data: result,
  });
});
const updateRunContest = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  const result = await RunContestService.updateRunContestFromDb(
    id,
    req,
    updateData
  );

  sendResponse<IRunContest>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull update RunContest',
    data: result,
  });
});

const updateRunContestWinner = catchAsync(
  async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id } = req.params;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updateData = req.body;

    const result = await RunContestService
      .updateRunContestWinnerFromDb
      // id,
      // req,
      // updateData
      ();

    sendResponse<IRunContest>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull update RunContest',
      data: result,
    });
  }
);

const deleteRunContest = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await RunContestService.deleteRunContestByIdFromDb(id, req);
  sendResponse<IRunContest>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull delete RunContest',
    data: result,
  });
});
export const RunContestController = {
  createRunContest,
  getAllRunContest,
  getSingleRunContest,
  updateRunContest,
  updateRunContestWinner,
  deleteRunContest,
};
