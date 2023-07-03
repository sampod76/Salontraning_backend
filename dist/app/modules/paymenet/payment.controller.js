"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentController = void 0;
const paypal_rest_sdk_1 = __importDefault(require("paypal-rest-sdk"));
const stripe_1 = __importDefault(require("stripe"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const catchAsync_1 = __importDefault(require("../../share/catchAsync"));
const stripe = new stripe_1.default(process.env.STRIPE_SK, null);
// import { z } from 'zod'
const createPaymentStripe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { paymentAmount: price } = req.body;
    const amount = parseFloat(price) * 100;
    const paymentIntent = yield stripe.paymentIntents.create({
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
    }
    else {
        throw new ApiError_1.default(404, 'Payment faild');
    }
    // next();
    /* res.status(200).send({
        success: true,
        data: result,
        message: 'successfull create  Lession',
      }); */
}));
// payple intergrate
const createPaymentPayple = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, item_list, description } = req.body;
    console.log(item_list);
    paypal_rest_sdk_1.default.configure({
        mode: 'sandbox',
        client_id: process.env.PAYPLE_CLIENT_ID,
        client_secret: process.env.PAYPLE_SECRET_KEY,
    });
    const payment = {
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
                item_list,
                amount: {
                    currency: 'USD',
                    total: String(amount === null || amount === void 0 ? void 0 : amount.total),
                },
                description: description,
            },
        ],
    };
    paypal_rest_sdk_1.default.payment.create(payment, (error, payment) => {
        if (error) {
            console.log(error);
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Payple pryment faild !!!',
                error,
            });
        }
        else {
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
}));
exports.createPaymentController = {
    createPaymentStripe,
    createPaymentPayple,
};
