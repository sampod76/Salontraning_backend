import express from 'express';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { createPaymentController } from './payment.controller';
import { PaymentValidation } from './payment.validation';

const router = express.Router();

router
  .route('/create-payment-intent')
  .post(
    validateRequestZod(PaymentValidation.createPaymentZodSchema),
    createPaymentController.createPaymentStripe
  );
router
  .route('/paypal')
  .post(
    validateRequestZod(PaymentValidation.createPaypleZodSchema),
    createPaymentController.createPaymentPayple
  );

export const PaymentRoute = router;
