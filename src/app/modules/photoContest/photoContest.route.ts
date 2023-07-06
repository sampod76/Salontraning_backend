import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { PhotoContestUserController } from './photoContest.constroller';
import { PhotoContestUserValidation } from './photoContest.validation';

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
  .route('/winner/:id')
  //after winner list
  // .get(PhotoContestUserController)
  .patch(
    authMiddleware(ENUM_USER_ROLE.ADMIN),
    validateRequestZod(PhotoContestUserValidation.updatePhotoContestUserWinner),
    PhotoContestUserController.updatePhotoContestUser
  );

router
  .route('/voie-message-share/:id')
  //after winner list
  // .get(PhotoContestUserController)
  .patch(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.GENERAL_USER),
    validateRequestZod(
      PhotoContestUserValidation.createPhotoContestVoteZodSchema
    ),
    PhotoContestUserController.voteMassageSharePhotoContestUser
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

export const PhotoContestUserRoute = router;
