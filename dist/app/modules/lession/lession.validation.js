"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessionValidation = void 0;
const zod_1 = require("zod");
const createLessionZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, { message: 'Title is required' }).trim(),
        header_1: zod_1.z.string().optional(),
        header_2: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        thumbnail: zod_1.z.string().optional(),
        status: zod_1.z.enum(['active', 'deactive']).optional(),
        course: zod_1.z.string({ required_error: 'course id is required' }),
        courseId: zod_1.z.string({ required_error: 'courseId is required' }),
        tag: zod_1.z.array(zod_1.z.string().optional()).optional(),
        vedio_link: zod_1.z.string({ required_error: 'Vedio lini is required' }),
        duration: zod_1.z.string().optional(),
    }),
});
const updateLessionZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        header_1: zod_1.z.string().optional(),
        header_2: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        thumbnail: zod_1.z.string().optional(),
        status: zod_1.z.enum(['active', 'deactive']).optional(),
        course: zod_1.z.string().optional(),
        courseId: zod_1.z.string(),
        tag: zod_1.z.array(zod_1.z.string().optional()).optional(),
        vedio_link: zod_1.z.string().optional(),
        duration: zod_1.z.string().optional(),
    }),
});
exports.LessionValidation = {
    createLessionZodSchema,
    updateLessionZodSchema,
};