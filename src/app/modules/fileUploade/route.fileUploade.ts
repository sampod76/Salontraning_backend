import express from 'express';
import {
  uploadMultipleImage,
  uploadSingleImage,
  uploadVideoFile,
} from '../../middlewares/uploader.multer';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { FileUploadeController } from './constroller.fileUploade';
import { FileUploadeValidation } from './validation.fileUploade';
import authMiddleware from '../../middlewares/authMiddleware';
import { ENUM_USER_ROLE } from '../../../enums/users';

const router = express.Router();

router
  .route('/uploade-single-image')
  .post(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.GENERAL_USER),
    uploadSingleImage,
    FileUploadeController.uploadeSingleFileByServer
  );
router
  .route('/uploade-multipal-images')
  .post(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.GENERAL_USER),
    uploadMultipleImage,
    FileUploadeController.uploadeMultipalFileByServer
  );

router
  .route('/uploade-vedio')
  .post(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.GENERAL_USER),
    uploadVideoFile,
    FileUploadeController.uploadeSingleFileByServer
  );
// router.route('/uploade-multipal-vedios').post(
//   uploadMultipleImage, FileUploadeController.uploadeSingleFileByServer);

router
  .route('/')
  .get(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.GENERAL_USER),
    FileUploadeController.getAllFileUploade
  )
  .post(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.GENERAL_USER),
    validateRequestZod(FileUploadeValidation.createFileUploadezodSchema),
    FileUploadeController.createFileUploade
  );

router
  .route('/:id')
  .get(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.GENERAL_USER),
    FileUploadeController.getSingleFileUploade
  )
  .patch(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.GENERAL_USER),
    validateRequestZod(FileUploadeValidation.updateFileUploadezodSchema),
    FileUploadeController.updateFileUploade
  )
  .delete(FileUploadeController.deleteFileUploade);

export const FileUploadeRoute = router;