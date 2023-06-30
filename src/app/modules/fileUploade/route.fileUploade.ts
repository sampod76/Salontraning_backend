import express from 'express';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { FileUploadeController } from './constroller.fileUploade';
import { FileUploadeValidation } from './validation.fileUploade';

const router = express.Router();

router
  .route('/')
  .get(FileUploadeController.getAllFileUploade)
  .post(
    validateRequestZod(FileUploadeValidation.createFileUploadezodSchema),
    FileUploadeController.createFileUploade
  );

router
  .route('/:id')
  .get(FileUploadeController.getSingleFileUploade)
  .patch(
    validateRequestZod(FileUploadeValidation.updateFileUploadezodSchema),
    FileUploadeController.updateFileUploade
  )
  .delete(FileUploadeController.deleteFileUploade);

export const FileUploadeRoute = router;
