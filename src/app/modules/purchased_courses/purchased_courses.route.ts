import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { Purchased_coursesController } from './purchased_courses.controller';
import { PurchasedCoursesValidation } from './purchased_courses.validation';
import decryptMiddleware from '../../middlewares/decryptBodyData';

const router = express.Router();

router
  .route('/')
  .get(
    authMiddleware(ENUM_USER_ROLE.ADMIN),
    Purchased_coursesController.getAllPurchased_courses
  )
  .post(
    decryptMiddleware(),
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.GENERAL_USER),
    validateRequestZod(
      PurchasedCoursesValidation.cteateZodPurchasedCoursesSchema
    ),
    Purchased_coursesController.createPurchased_courses
  );

router
  .route('/:id')
  .get(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.GENERAL_USER),
    Purchased_coursesController.getSinglePurchased_courses
  )
  .put(
    authMiddleware(ENUM_USER_ROLE.ADMIN),
    validateRequestZod(
      PurchasedCoursesValidation.updateZodPurchasedCoursesSchema
    ),
    Purchased_coursesController.updatePurchased_courses
  )
  .delete(
    authMiddleware(ENUM_USER_ROLE.ADMIN),
    Purchased_coursesController.deletePurchased_courses
  );

export const Purchased_coursesRoute = router;
