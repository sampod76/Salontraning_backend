"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralUserValidation = void 0;
const zod_1 = require("zod");
const constant_GeneralUser_1 = require("./constant.GeneralUser");
const updateGeneralUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        gender: zod_1.z.enum([...constant_GeneralUser_1.GENDER]).optional(),
        dateOfBirth: zod_1.z.string().optional(),
        email: zod_1.z.string().email().optional(),
        phone: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
        profileImage: zod_1.z.string().optional(),
        status: zod_1.z.enum(['active', 'deactive']).optional(),
    }),
});
const createGeneralUserByFirebaseZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string(),
        gender: zod_1.z.enum([...constant_GeneralUser_1.GENDER]).optional(),
        dateOfBirth: zod_1.z.string().optional(),
        email: zod_1.z.string().email().optional(),
        phone: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
        profileImage: zod_1.z.string().optional(),
        uid: zod_1.z.string(),
        status: zod_1.z.enum(['active', 'deactive']).optional(),
    }),
});
exports.GeneralUserValidation = {
    updateGeneralUserZodSchema,
    createGeneralUserByFirebaseZodSchema,
};
