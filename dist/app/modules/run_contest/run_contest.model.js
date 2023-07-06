"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunContest = void 0;
const mongoose_1 = require("mongoose");
const RunContestSchema = new mongoose_1.Schema({
    contestId: { type: Number, min: 0 },
    title: String,
    header_1: String,
    description: String,
    // thumbnail: String or IFileUploadeMongooseSchema (depending on the type),
    thumbnail: {
        type: mongoose_1.Types.ObjectId,
        ref: 'FileUploade',
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'deactive', 'save'],
    },
    winnerPrize: [
        {
            title: String,
            thumbnail: {
                type: mongoose_1.Types.ObjectId,
                ref: 'FileUploade',
                required: true,
            },
            prize_serial: { type: Number, unique: true },
            prize_value: Number,
        },
    ],
    duration_time: {
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
    },
    //after contest end then update
    winnerList: [
        {
            photo_contest_id: {
                type: mongoose_1.Types.ObjectId,
                ref: 'Photo_contest_user',
                require: [true, 'user id is required'],
            },
            email: String,
            name: String,
            phone: String,
        },
    ],
}, {
    timestamps: true,
    // strict: 'throw',
    toJSON: {
        virtuals: true,
    },
});
exports.RunContest = (0, mongoose_1.model)('RunContest', RunContestSchema);
