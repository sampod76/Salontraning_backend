import express from 'express';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { PhotoContestUserController } from './photoContest.constroller';
import { PhotoContestUserValidation } from './photoContest.validation';
import authMiddleware from '../../middlewares/authMiddleware';
import { ENUM_USER_ROLE } from '../../../enums/users';

const router = express.Router();

router
  .route('/')
  .get(PhotoContestUserController.getAllPhotoContestUser)
  .post(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.GENERAL_USER),
    validateRequestZod(
      PhotoContestUserValidation.createPhotoContestUserZodSchema
    ),
    PhotoContestUserController.createPhotoContestUser
  );

router
  .route('/:id')
  .get(PhotoContestUserController.getSinglePhotoContestUser)
  .patch(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.GENERAL_USER),
    validateRequestZod(
      PhotoContestUserValidation.updatePhotoContestUserZodSchema
    ),
    PhotoContestUserController.updatePhotoContestUser
  )
  .delete(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.GENERAL_USER),
    PhotoContestUserController.deletePhotoContestUser
  );

router
  .route('winner/:id')
  .get(PhotoContestUserController.getSinglePhotoContestUser)
  .patch(
    authMiddleware(ENUM_USER_ROLE.ADMIN),
    validateRequestZod(PhotoContestUserValidation.updatePhotoContestUserWinner),
    PhotoContestUserController.updatePhotoContestUser
  );

export const PhotoContestUserRoute = router;
