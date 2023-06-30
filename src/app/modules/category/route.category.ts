import express from 'express';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { CategoryController } from './constroller.category';
import { CategoryValidation } from './validation.category';

const router = express.Router();

router
  .route('/')
  .get(CategoryController.getAllCategory)
  .post(
    validateRequestZod(CategoryValidation.createCategoryZodSchema),
    CategoryController.createCategory
  );

router
  .route('/:id')
  .get(CategoryController.getSingleCategory)
  .patch(
    validateRequestZod(CategoryValidation.updateCategoryZodSchema),
    CategoryController.updateCategory
  )
  .delete(CategoryController.deleteCategory);

export const CategoryRoute = router;
