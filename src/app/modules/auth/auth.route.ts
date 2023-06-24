import express from 'express';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';
const router = express.Router();

router
  .route('/login')
  .post(
    validateRequestZod(AuthValidation.loginZodSchema),
    AuthController.loginUser
  );
router
  .route('/refresh-token')
  .post(
    validateRequestZod(AuthValidation.refreshTokenZodSchema),
    AuthController.refreshToken
  );

export const AuthRouter = router;
