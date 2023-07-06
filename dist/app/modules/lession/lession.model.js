"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lession = void 0;
const mongoose_1 = require("mongoose");
const LessionSchema = new mongoose_1.Schema({
    lessionId: {
        // auto generate
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    vedio_link: {
        type: String,
        trim: true,
        required: true,
    },
    duration: Number,
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
        type: mongoose_1.Types.ObjectId,
        ref: 'FileUploade',
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'deactive', 'save'],
        default: 'active',
    },
    tag: [
        {
            type: String,
        },
    ],
    course: {
        type: mongoose_1.Types.ObjectId,
        ref: 'Course',
        required: true,
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
exports.Lession = (0, mongoose_1.model)('Lession', LessionSchema);
