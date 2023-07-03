import { Request, Response } from 'express';

import catchAsync from '../../share/catchAsync';
import Stripe from 'stripe';
import ApiError from '../../errors/ApiError';
import paypal, { Payment } from 'paypal-rest-sdk';
const stripe = new Stripe(process.env.STRIPE_SK as string, null as any);

type IItem = {
  name: string;
  sku?: string;
  price: number;
  currency?: string;
  quantity?: number;
};

// import { z } from 'zod'
const createPaymentStripe = catchAsync(async (req: Request, res: Response) => {
  const { paymentAmount: price } = req.body;
  const amount: number = parseFloat(price) * 100;

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
  // next();
  /* res.status(200).send({
      success: true,
      data: result,
      message: 'successfull create  Lession',
    }); */
});

// payple intergrate
const createPaymentPayple = catchAsync(async (req: Request, res: Response) => {
  const { amount, item_list, description } = req.body;
  paypal.configure({
    mode: 'sandbox',
    client_id: process.env.PAYPLE_CLIENT_ID as string,
    client_secret: process.env.PAYPLE_SECRET_KEY as string,
  });
  const payment: Payment = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal',
    },
    redirect_urls: {
      return_url: `${process.env.LOCALHOST_CLIENT_SIDE}/success`,
      cancel_url: `${process.env.LOCALHOST_CLIENT_SIDE}/cancel`,
    },
    transactions: [
      {
        item_list: {
          items: item_list?.items?.map((item: IItem) => ({
            ...item,
            price: String(item.price),
          })),
        },
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
      throw new ApiError(404, 'Payment faild!!');
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
});

export const createPaymentController = {
  createPaymentStripe,
  createPaymentPayple,
};
