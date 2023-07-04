"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoute = void 0;
const express_1 = __importDefault(require("express"));
const validateRequestZod_1 = __importDefault(require("../../middlewares/validateRequestZod"));
const payment_controller_1 = require("./payment.controller");
const payment_validation_1 = require("./payment.validation");
const authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
const users_1 = require("../../../enums/users");
const router = express_1.default.Router();
router
    .route('/create-payment-intent')
    .post((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.GENERAL_USER), (0, validateRequestZod_1.default)(payment_validation_1.PaymentValidation.createPaymentZodSchema), payment_controller_1.createPaymentController.createPaymentStripe);
router
    .route('/paypal')
    .post((0, authMiddleware_1.default)(users_1.ENUM_USER_ROLE.GENERAL_USER), (0, validateRequestZod_1.default)(payment_validation_1.PaymentValidation.createPaypleZodSchema), payment_controller_1.createPaymentController.createPaymentPayple);
exports.PaymentRoute = router;
