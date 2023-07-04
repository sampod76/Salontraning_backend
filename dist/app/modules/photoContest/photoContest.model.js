"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoContestUser = void 0;
const mongoose_1 = require("mongoose");
const PhotoContestSchemaUser = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Types.ObjectId,
        required: true,
        ref: 'General_user',
    },
    name: String,
    header_1: String,
    description: String,
    thumbnail: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'deactive'],
        default: 'active',
    },
    loveReact: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: 'General_user',
        },
    ],
    message: [
        {
            userId: {
                type: mongoose_1.Types.ObjectId,
                required: true,
                ref: 'General_user',
            },
            message: {
                type: String,
                required: true,
            },
        },
    ],
    share: {
        type: Number,
        default: 0,
    },
    winnerData: {
        date: {
            type: String,
            required: true,
        },
        winner: {
            type: Number,
            required: true,
        },
    },
}, {
    timestamps: true,
    // strict: 'throw',
    toJSON: {
        virtuals: true,
    },
});
exports.PhotoContestUser = (0, mongoose_1.model)('Photo_contest_user', PhotoContestSchemaUser);
