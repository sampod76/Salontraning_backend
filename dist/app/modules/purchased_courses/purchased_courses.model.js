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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Purchased_courses = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = require("mongoose");
const course_model_1 = require("../course/course.model");
const purchasedCoursesSchema = new mongoose_2.Schema({
    userId: {
        type: mongoose_1.Types.ObjectId,
        ref: 'General_user',
        required: true,
    },
    userName: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    payment: {
        type: {
            price: {
                type: Number,
                trim: true,
                required: true,
            },
            vat: {
                type: Number,
            },
            discount: {
                type: Number,
            },
            total: {
                type: Number,
            },
            method: {
                type: String,
            },
            method_TransactionID: {
                type: String,
            },
        },
        required: true,
    },
    course: {
        type: mongoose_1.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    courseId: {
        type: String,
        trim: true,
    },
    transactionID: String, // not provide
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
//All calculations will be done here while buying any product
purchasedCoursesSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { price = 0, discount = 0, vat = 0, } = (yield course_model_1.Course.findById(this.course));
        const afterDiscount = price - (price / 100) * discount;
        this.payment.total = afterDiscount + (afterDiscount / 100) * vat;
        this.payment.discount = discount;
        this.payment.vat = vat;
        this.payment.price = price;
        this.transactionID =
            this.courseId + '-' + Math.random().toString(16).slice(2);
        next();
    });
});
exports.Purchased_courses = (0, mongoose_1.model)('PurchasedCourses', purchasedCoursesSchema);
