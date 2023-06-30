"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = void 0;
const mongoose_1 = require("mongoose");
// import { format } from 'date-fns';
const courseSchema = new mongoose_1.Schema({
    courseId: {
        type: String,
        unique: true,
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        default: 0,
    },
    vat: {
        type: Number,
        default: 0,
    },
    header_1: String,
    header_2: String,
    description: String,
    thumbnail: String,
    publish: {
        type: {
            status: {
                type: String,
                enum: ['active', 'deactive', 'save'],
                default: 'active',
            },
            time: {
                type: Date,
                // default: () => {
                //   // Get the current date
                //   const today = new Date();
                //   const dateString = format(today, 'yyyy-MM-dd');
                //   return dateString;
                // },
            },
        },
    },
    publisher: {
        // type: mongoose.Schema.Types.ObjectId,
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    publisherName: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'deactive'],
        default: 'active',
    },
    tag: [
        {
            type: String,
            trim: true,
        },
    ],
}, {
    timestamps: true,
    // strict: 'throw',
    toJSON: {
        virtuals: true,
    },
});
exports.Course = (0, mongoose_1.model)('Course', courseSchema);
