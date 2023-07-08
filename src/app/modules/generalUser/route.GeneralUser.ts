import express from 'express';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { GeneralUserController } from './controller.GeneralUser';
import { GeneralUserValidation } from './validation.GeneralUser';
import authMiddleware from '../../middlewares/authMiddleware';
import { ENUM_USER_ROLE } from '../../../enums/users';

const router = express.Router();
router
  .route('/')
  .get(
    authMiddleware(ENUM_USER_ROLE.ADMIN),
    GeneralUserController.getAllGeneralUsers
  )
  // sign up user
  .post(
    validateRequestZod(
      GeneralUserValidation.createGeneralUserByFirebaseZodSchema
    ),
    GeneralUserController.createGeneralUserByFirebase
  );

router
  .route('/get-course/:id')
  .get(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.GENERAL_USER),
    GeneralUserController.getSingleGeneralUserToCourse
  );

router
  .route('/update-course-quiz/:id')
  .patch(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.GENERAL_USER),
    GeneralUserController.updateCourseVedioOrQuiz
  );

router
  .route('/:id')
  .get(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.GENERAL_USER),
    GeneralUserController.getSingleGeneralUser
  )
  .delete(
    authMiddleware(ENUM_USER_ROLE.ADMIN),
    GeneralUserController.deleteGeneralUser
  )
  .patch(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.GENERAL_USER),
    validateRequestZod(GeneralUserValidation.updateGeneralUserZodSchema),
    GeneralUserController.updateGeneralUser
  );

export const GeneralUserRoutes = router;
