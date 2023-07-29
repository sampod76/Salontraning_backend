import express from 'express';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { LessionController } from './lession.constroller';
import { LessionValidation } from './lession.validation';

const router = express.Router();

router
  .route('/')
  .get(LessionController.getAllLession)
  .post(
    validateRequestZod(LessionValidation.createLessionZodSchema),
    LessionController.createLession
  );

router
  .route('/:id')
  .get(LessionController.getSingleLession)
  .put(
    validateRequestZod(LessionValidation.updateLessionZodSchema),
    LessionController.updateLession
  )
  .delete(LessionController.deleteLession);

export const LessionRoute = router;
