import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { NotificationController } from './constroller.notification';
import { NotificationValidation } from './validation.notification';

const router = express.Router();

router
  .route('/')
  // This route is open
  .get(NotificationController.getAllNotification)
  .post(
    authMiddleware(ENUM_USER_ROLE.ADMIN),
    validateRequestZod(NotificationValidation.createNotificationZodSchema),
    NotificationController.createNotification
  );

router
  .route('/:id')
  // This route is open
  .get(NotificationController.getSingleNotification)
  .put(
    authMiddleware(ENUM_USER_ROLE.ADMIN),
    validateRequestZod(NotificationValidation.updateNotificationZodSchema),
    NotificationController.updateNotification
  )
  .delete(
    authMiddleware(ENUM_USER_ROLE.ADMIN),
    NotificationController.deleteNotification
  );

export const NotificationRoute = router;
