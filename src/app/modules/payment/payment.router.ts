import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { createPaymentController } from './payment.controller';
import { PaymentValidation } from './payment.validation';

const router = express.Router();

// router
//   .route('/create-payment-intent')
//   .post(
//     authMiddleware(ENUM_USER_ROLE.GENERAL_USER),
//     validateRequestZod(PaymentValidation.createPaymentZodSchema),
//     createPaymentController.createPaymentStripe
//   );
/// alll i thish k
router
  .route('/create-payment-intent')
  .post(
    authMiddleware(ENUM_USER_ROLE.GENERAL_USER),
    validateRequestZod(PaymentValidation.createPaymentZodSchema),
    createPaymentController.createPaymentStripeAdvanceForNative
  );
router
  .route('/paypal')
  .post(
    authMiddleware(ENUM_USER_ROLE.GENERAL_USER),
    validateRequestZod(PaymentValidation.createPaypleZodSchema),
    createPaymentController.createPaymentPayple
  );

export const PaymentRoute = router;
