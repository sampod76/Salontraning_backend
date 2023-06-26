import express from 'express';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { CourseController } from './course.constroller';
import { CourseValidation } from './course.validation';

const router = express.Router();

router
  .route('/')
  .get(CourseController.getAllCourse)
  .post(
    validateRequestZod(CourseValidation.createCourseZodSchema),
    CourseController.createCourse
  );

router
  .route('/:id')
  .get(CourseController.getSingleCourse)
  .patch(
    validateRequestZod(CourseValidation.updateCourseZodSchema),
    CourseController.updateCourse
  )
  .delete(CourseController.deleteCourse);

export const CourseRoute = router;
