import express from 'express';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { createPaymentController } from './payment.controller';
import { PaymentValidation } from './payment.validation';
import authMiddleware from '../../middlewares/authMiddleware';
import { ENUM_USER_ROLE } from '../../../enums/users';

const router = express.Router();

router
  .route('/create-payment-intent')
  .post(
    authMiddleware(ENUM_USER_ROLE.GENERAL_USER),
    validateRequestZod(PaymentValidation.createPaymentZodSchema),
    createPaymentController.createPaymentStripe
  );
router
  .route('/paypal')
  .post(
    authMiddleware(ENUM_USER_ROLE.GENERAL_USER),
    validateRequestZod(PaymentValidation.createPaypleZodSchema),
    createPaymentController.createPaymentPayple
  );

export const PaymentRoute = router;
