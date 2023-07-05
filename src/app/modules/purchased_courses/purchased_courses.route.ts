import express from 'express';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { Purchased_coursesController } from './purchased_courses.controller';
import { PurchasedCoursesValidation } from './purchased_courses.validation';

const router = express.Router();

router
  .route('/')
  .get(Purchased_coursesController.getAllPurchased_courses)
  .post(
    validateRequestZod(
      PurchasedCoursesValidation.cteateZodPurchasedCoursesSchema
    ),
    Purchased_coursesController.createPurchased_courses
  );

router
  .route('/:id')
  .get(Purchased_coursesController.getSinglePurchased_courses)
  .patch(
    validateRequestZod(
      PurchasedCoursesValidation.updateZodPurchasedCoursesSchema
    ),
    Purchased_coursesController.updatePurchased_courses
  )
  .delete(Purchased_coursesController.deletePurchased_courses);

export const Purchased_coursesRoute = router;
