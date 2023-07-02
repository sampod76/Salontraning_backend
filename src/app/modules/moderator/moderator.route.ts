import express from 'express';

import validateRequestZod from '../../middlewares/validateRequestZod';
import { ModeratorController } from './moderator.controller';
import { ModeratorValidation } from './moderator.validations';

const router = express.Router();
router
  .route('/')
  .post(ModeratorController.createModerator)
  .get(ModeratorController.getAllModerators);

router
  .route('/:id')
  .get(ModeratorController.getSingleModerator)
  .patch(
    validateRequestZod(ModeratorValidation.updateModeratorZodSchema),
    ModeratorController.updateModerator
  )
  .delete(ModeratorController.deleteModerator);

export const ModeratorRoutes = router;
