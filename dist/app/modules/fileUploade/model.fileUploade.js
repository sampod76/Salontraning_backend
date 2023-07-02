"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploade = void 0;
const mongoose_1 = require("mongoose");
const FileUploadeSchema = new mongoose_1.Schema({
    title: {
        type: String,
        lowercase: true,
        unique: true,
        trim: true,
    },
    path: {
        type: String,
        trim: true,
    },
    category: {
        type: String,
        trim: true,
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
exports.FileUploade = (0, mongoose_1.model)('FileUploade', FileUploadeSchema);
