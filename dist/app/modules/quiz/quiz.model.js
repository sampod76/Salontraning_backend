"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quiz = void 0;
const mongoose_1 = require("mongoose");
const QuizSchema = new mongoose_1.Schema({
    // quizId: {
    //   type: String,
    // },
    quizList: [
        {
            title: {
                type: String,
                required: true,
                trim: true,
            },
            serial_no: Number,
            answers: {
                type: [String],
                required: true,
            },
            header_1: {
                type: String,
                trim: true,
            },
            header_2: {
                type: String,
                trim: true,
            },
            description: {
                type: String,
                trim: true,
            },
            thumbnail: {
                type: String,
                trim: true,
            },
            tag: {
                type: [String],
            },
            hint: {
                type: String,
                trim: true,
            },
        },
    ],
    status: {
        type: String,
        enum: ['active', 'deactive'],
        default: 'active',
    },
    course: {
        type: mongoose_1.Types.ObjectId,
        ref: 'Course',
    },
    courseId: {
        type: String,
    },
}, {
    timestamps: true,
    // strict: 'throw',
    toJSON: {
        virtuals: true,
    },
});
exports.Quiz = (0, mongoose_1.model)('Quiz', QuizSchema);
