import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constant/pagination';
// import { globalImport } from '../../../import/global_Import';
// import ApiError from '../../errors/ApiError';
import catchAsync from '../../share/catchAsync';
import pick from '../../share/pick';
import sendResponse from '../../share/sendResponse';

import { GeneralUser } from '../generalUser/model.GeneralUser';
import { NOTIFICATION_FILTERABLE_FIELDS } from './consent.notification';
import { INotification, INotificationAndId } from './interface.notification';
import { sendNotificationsToUsers } from './sendPush.notification';
import { NotificationService } from './service.notification';

// import { z } from 'zod'
const createNotification = catchAsync(async (req: Request, res: Response) => {
  const { ...NotificationData } = req.body;
  const result = (await NotificationService.createNotificationByDb(
    NotificationData
  )) as INotificationAndId;
  // console.log(req.body.users)
  let fcm_tokens: string[] = [];
  if (!req.body?.fcm_tokens?.length) {
    const datas = await GeneralUser.find({
      _id: { $in: req.body.users },
    }).select({ fcm_token: 1, _id: 0 });
    // console.log(datas)
    if (datas.length) {
      datas.forEach(data => {
        if (data?.fcm_token) {
          fcm_tokens.push(data.fcm_token);
        }
      });
    }
  } else {
    fcm_tokens = req.body?.fcm_tokens;
  }

  // console.log(fcm_tokens)
  sendNotificationsToUsers(fcm_tokens, {
    ...NotificationData,
    id: result._id.toString(),
  });

  sendResponse<INotification>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull create Notification',
    data: result,
  });
});

const getAllNotification = catchAsync(async (req: Request, res: Response) => {
  //****************search and filter start******* */
  let queryObject = req.query;
  queryObject = Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(queryObject).filter(([_, value]) => Boolean(value))
  );
  const filters = pick(queryObject, NOTIFICATION_FILTERABLE_FIELDS);

  //****************pagination start************ */

  const paginationOptions = pick(queryObject, PAGINATION_FIELDS);

  const result = await NotificationService.getAllNotificationFromDb(
    filters,
    paginationOptions
  );

  sendResponse<INotification[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull Get Notification',
    meta: result.meta,
    data: result.data,
  });
  // next();
});

const getSingleNotification = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    /*   if (!globalImport.ObjectId.isValid(id)) {
      throw new ApiError(400, 'invalid id sampod');
    } */

    const result = await NotificationService.getSingleNotificationFromDb(id);

    /* if (!result) {
      throw new ApiError(400, 'No data found');
    } */
    sendResponse<INotification>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'successfull get Notification',
      data: result,
    });
  }
);
const updateNotification = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  /*   if (!globalImport.ObjectId.isValid(id)) {
      throw new ApiError(400, 'invalid id sampod');
    } */

  const result = await NotificationService.updateNotificationFromDb(
    id,
    updateData
  );

  /* if (!result) {
      throw new ApiError(400, 'No data found');
    } */
  sendResponse<INotification>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull update Notification',
    data: result,
  });
});

const deleteNotification = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await NotificationService.deleteNotificationByIdFromDb(id);
  sendResponse<INotification>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'successfull delete Notification',
    data: result,
  });
});
export const NotificationController = {
  createNotification,
  getAllNotification,
  getSingleNotification,
  updateNotification,
  deleteNotification,
};
