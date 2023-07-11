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
const mongoose_1 = require("mongoose");
const paypal_rest_sdk_1 = __importDefault(require("paypal-rest-sdk"));
const stripe_1 = __importDefault(require("stripe"));
const encryption_1 = require("../../../helper/encryption");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const catchAsync_1 = __importDefault(require("../../share/catchAsync"));
const model_GeneralUser_1 = require("../generalUser/model.GeneralUser");
const purchased_courses_model_1 = require("../purchased_courses/purchased_courses.model");
// import { errorLogger, logger } from '../../share/logger';
// import { z } from 'zod'
const createPaymentStripe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const stripe = new stripe_1.default(process.env.STRIPE_SK, {
        apiVersion: '2022-11-15',
        typescript: true,
    });
    const { paymentAmount: price, course_id } = req.body;
    const amount = parseFloat(price) * 100;
    const result = yield model_GeneralUser_1.GeneralUser.findById((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id);
    const courseIdExaite = (_b = result === null || result === void 0 ? void 0 : result.purchase_courses) === null || _b === void 0 ? void 0 : _b.find(value => { var _a; return ((_a = value === null || value === void 0 ? void 0 : value.course) === null || _a === void 0 ? void 0 : _a.toString()) === course_id; });
    if (courseIdExaite) {
        return res.status(404).send({
            success: false,
            statusCode: 404,
            message: 'You are already purchased course!!😭😭',
        });
    }
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
}));
// payple intergrate
const createPaymentPayple = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e;
    const { amount, item_list, description } = req.body;
    paypal_rest_sdk_1.default.configure({
        mode: 'sandbox',
        client_id: process.env.PAYPLE_CLIENT_ID,
        client_secret: process.env.PAYPLE_SECRET_KEY,
    });
    // const itemSkus = new Set(item_list?.items?.map((item: any) => item?.sku));
    const item = new mongoose_1.Types.ObjectId((_c = item_list === null || item_list === void 0 ? void 0 : item_list.items[0]) === null || _c === void 0 ? void 0 : _c.sku);
    const findByCourse = yield purchased_courses_model_1.Purchased_courses.findOne({
        userId: new mongoose_1.Types.ObjectId((_d = req === null || req === void 0 ? void 0 : req.user) === null || _d === void 0 ? void 0 : _d._id),
        course: new mongoose_1.Types.ObjectId(item),
    });
    if (findByCourse) {
        return res.status(404).send({
            success: false,
            statusCode: 404,
            message: 'You are already purchased course!!😭😭',
        });
    }
    const data = {
        userId: (_e = req === null || req === void 0 ? void 0 : req.user) === null || _e === void 0 ? void 0 : _e._id,
        course_id: item.toString(),
        amount: {
            currency: (amount === null || amount === void 0 ? void 0 : amount.currency) || 'USD',
            total: amount === null || amount === void 0 ? void 0 : amount.total,
        },
    };
    const encriptData = (0, encryption_1.encrypt)(data);
    const payment = {
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
                    total: String(amount === null || amount === void 0 ? void 0 : amount.total),
                },
                description: description,
            },
        ],
    };
    paypal_rest_sdk_1.default.payment.create(payment, (error, payment) => {
        if (error) {
            console.log(error);
            // errorLogger.error(error)
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Payple pryment faild !!!',
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
}));
const createPaymentStripeAdvanceForNative = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f, _g;
    const { paymentAmount: price, course_id } = req.body;
    const amount = parseFloat(price) * 100;
    //********** */ You are already purchased course!!*******
    const result = yield model_GeneralUser_1.GeneralUser.findById((_f = req === null || req === void 0 ? void 0 : req.user) === null || _f === void 0 ? void 0 : _f._id);
    const courseIdExaite = (_g = result === null || result === void 0 ? void 0 : result.purchase_courses) === null || _g === void 0 ? void 0 : _g.find(value => { var _a; return ((_a = value === null || value === void 0 ? void 0 : value.course) === null || _a === void 0 ? void 0 : _a.toString()) === course_id; });
    if (courseIdExaite) {
        return res.status(404).send({
            success: false,
            statusCode: 404,
            message: 'You are already purchased course!!😭😭',
        });
    }
    //********** */ You are already purchased course!!*******
    const stripe = new stripe_1.default(process.env.STRIPE_SK, {
        apiVersion: '2022-11-15',
        typescript: true,
    });
    // Use an existing Customer ID if this is a returning customer.
    const customer = yield stripe.customers.create();
    const ephemeralKey = yield stripe.ephemeralKeys.create({ customer: customer.id }, { apiVersion: '2022-11-15' });
    const paymentIntent = yield stripe.paymentIntents.create({
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
    }
    else {
        throw new ApiError_1.default(404, 'Payment faild');
    }
}));
exports.createPaymentController = {
    createPaymentStripe,
    createPaymentStripeAdvanceForNative,
    createPaymentPayple,
};
