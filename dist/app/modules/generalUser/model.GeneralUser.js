"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralUser = void 0;
const mongoose_1 = require("mongoose");
const constant_GeneralUser_1 = require("./constant.GeneralUser");
const users_1 = require("../../../enums/users");
const GeneralUserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    gender: {
        type: String,
        enum: constant_GeneralUser_1.GENDER,
    },
    role: {
        type: String,
        default: users_1.ENUM_USER_ROLE.GENERAL_USER,
    },
    dateOfBirth: {
        type: String,
        // required: true,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        // required: true,
    },
    phone: {
        type: String,
        unique: true,
        // required: true,
    },
    profileImage: {
        type: String,
        // required: true,
    },
    uid: {
        type: String,
        unique: true,
    },
    status: {
        type: String,
        enum: ['active', 'deactive'],
        default: 'active',
    },
    // purchase_courses: [
    //   {
    //     courseId: { type: Types.ObjectId, ref: 'Course' },
    //     total_completed_vedio: [Types.ObjectId],
    //   },
    // ],
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.GeneralUser = (0, mongoose_1.model)('General_user', GeneralUserSchema);
