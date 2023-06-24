import express from 'express';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { GeneralUserController } from './controller.GeneralUser';
import { GeneralUserValidation } from './validation.GeneralUser';

const router = express.Router();
router
  .route('/')
  .get(GeneralUserController.getAllGeneralUsers)
  // sign up user
  .post(
    validateRequestZod(
      GeneralUserValidation.createGeneralUserByFirebaseZodSchema
    ),
    GeneralUserController.createGeneralUserByFirebase
  );
router
  .route('/:id')
  .get(GeneralUserController.getSingleGeneralUser)
  .delete(GeneralUserController.deleteGeneralUser)
  .patch(
    validateRequestZod(GeneralUserValidation.updateGeneralUserZodSchema),
    GeneralUserController.updateGeneralUser
  );

export const GeneralUserRoutes = router;
