import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { RunContestController } from './run_contest.constroller';
import { RunContestValidation } from './run_contest.validation';

const router = express.Router();

router.route('/').get(RunContestController.getAllRunContest).post(
  authMiddleware(ENUM_USER_ROLE.ADMIN),

  validateRequestZod(RunContestValidation.createRunContestZodSchema),
  RunContestController.createRunContest
);

router
  .route('/:id')
  .get(
    authMiddleware(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.GENERAL_USER),
    RunContestController.getSingleRunContest
  )
  .patch(
    authMiddleware(ENUM_USER_ROLE.ADMIN),
    validateRequestZod(RunContestValidation.updateRunContestZodSchema),
    RunContestController.updateRunContest
  )
  .delete(
    authMiddleware(ENUM_USER_ROLE.ADMIN),
    RunContestController.deleteRunContest
  );

export const RunContestRoute = router;
