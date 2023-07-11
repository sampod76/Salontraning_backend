import { Request, Response } from 'express';
import { Types } from 'mongoose';
import paypal, { Payment } from 'paypal-rest-sdk';
import Stripe from 'stripe';
import { IEncodedData, encrypt } from '../../../helper/encryption';
import ApiError from '../../errors/ApiError';
import catchAsync from '../../share/catchAsync';
import { GeneralUser } from '../generalUser/model.GeneralUser';
import { Purchased_courses } from '../purchased_courses/purchased_courses.model';

// import { errorLogger, logger } from '../../share/logger';

// import { z } from 'zod'
const createPaymentStripe = catchAsync(async (req: Request, res: Response) => {
  const stripe = new Stripe(process.env.STRIPE_SK as string, {
    apiVersion: '2022-11-15',
    typescript: true,
  });
  const { paymentAmount: price, course_id } = req.body;
  const amount: number = parseFloat(price) * 100;

  const result = await GeneralUser.findById(req?.user?._id);
  const courseIdExaite = result?.purchase_courses?.find(
    value => value?.course?.toString() === course_id
  );

  if (courseIdExaite) {
    return res.status(404).send({
      success: false,
      statusCode: 404,
      message: 'You are already purchased course!!😭😭',
    });
  }

  const paymentIntent: Stripe.PaymentIntent =
    await stripe.paymentIntents.create({
      amount,
      currency: 'USD',
      payment_method_types: ['card'],
    });

  if (paymentIntent.client_secret) {
    res.status(200).send({
      success: true,
      statusCode: 200,
      message: 'successfull get secret',
      data: { clientSecret: paymentIntent.client_secret },
    });
  } else {
    throw new ApiError(404, 'Payment faild');
  }
});

// payple intergrate
const createPaymentPayple = catchAsync(async (req: Request, res: Response) => {
  const { amount, item_list, description } = req.body;

  paypal.configure({
    mode: 'sandbox',
    client_id: process.env.PAYPLE_CLIENT_ID as string,
    client_secret: process.env.PAYPLE_SECRET_KEY as string,
  });

  // const itemSkus = new Set(item_list?.items?.map((item: any) => item?.sku));
  const item = new Types.ObjectId(item_list?.items[0]?.sku);
  const findByCourse = await Purchased_courses.findOne({
    userId: new Types.ObjectId(req?.user?._id),
    course: new Types.ObjectId(item),
  });

  if (findByCourse) {
    return res.status(404).send({
      success: false,
      statusCode: 404,
      message: 'You are already purchased course!!😭😭',
    });
  }
  const data: IEncodedData = {
    userId: req?.user?._id,
    course_id: item.toString(),
    amount: {
      currency: amount?.currency || 'USD',
      total: amount?.total,
    },
  };

  const encriptData = encrypt(data);

  const payment: Payment = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal',
    },
    redirect_urls: {
      return_url: `${process.env.REAL_HOST_SERVER_SIDE}/success?app=${encriptData}`,
      cancel_url: `${process.env.REAL_HOST_SERVER_SIDE}/cancel`,
    },
    transactions: [
      {
        item_list,
        amount: {
          currency: 'USD',
          total: String(amount?.total),
        },
        description: description,
      },
    ],
  };

  paypal.payment.create(payment, (error: any, payment: any) => {
    if (error) {
      console.log(error);
      // errorLogger.error(error)
      return res.status(404).send({
        success: false,
        statusCode: 404,
        message: 'Payple pryment faild !!!',
      });
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === 'approval_url') {
          res.status(200).send({
            success: true,
            message: `Successfully Payple payment instant`,
            data: {
              url: payment.links[i].href,
            },
          });
        }
      }
    }
  });
  // app.get('/success', (req, res) => {
  //   const payerId = req.query.PayerID;
  //   const paymentId = req.query.paymentId;
  //   console.log("payerId",payerId,"paymentId",paymentId)
  //   const execute_payment_json = {
  //     "payer_id": payerId,
  //     "transactions": [{
  //         "amount": {
  //             "currency": "USD",
  //             "total": amt
  //         }
  //     }]
  //   };

  //   paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
  //     if (error) {
  //         console.log("error",error.response);
  //         throw error;
  //     } else {
  //         res.sendFile(__dirname + "/success.html")
  //     }
  // });
});

const createPaymentStripeAdvanceForNative = catchAsync(
  async (req: Request, res: Response) => {
    const { paymentAmount: price, course_id } = req.body;
    const amount: number = parseFloat(price) * 100;

    //********** */ You are already purchased course!!*******
    const result = await GeneralUser.findById(req?.user?._id);
    const courseIdExaite = result?.purchase_courses?.find(
      value => value?.course?.toString() === course_id
    );
    if (courseIdExaite) {
      return res.status(404).send({
        success: false,
        statusCode: 404,
        message: 'You are already purchased course!!😭😭',
      });
    }
    //********** */ You are already purchased course!!*******

    const stripe = new Stripe(process.env.STRIPE_SK as string, {
      apiVersion: '2022-11-15',
      typescript: true,
    });

    // Use an existing Customer ID if this is a returning customer.
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2022-11-15' }
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'USD',
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    if (paymentIntent.client_secret) {
      res.status(200).send({
        success: true,
        statusCode: 200,
        message: 'successfull get secret',
        data: {
          // paymentIntent: paymentIntent.client_secret,
          clientSecret: paymentIntent.client_secret,
          ephemeralKey: ephemeralKey.secret,
          customer: customer.id,
          publishableKey: process.env.STRIPE_PK,
        },
      });
    } else {
      throw new ApiError(404, 'Payment faild');
    }
  }
);

export const createPaymentController = {
  createPaymentStripe,
  createPaymentStripeAdvanceForNative,
  createPaymentPayple,
};
