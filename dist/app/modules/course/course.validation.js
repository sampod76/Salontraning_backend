"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseValidation = void 0;
const zod_1 = require("zod");
const createCourseZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: 'title field is required' }),
        price: zod_1.z.number().nonnegative().optional(),
        discount: zod_1.z.number().nonnegative().max(100).optional(),
        vat: zod_1.z.number().nonnegative().optional(),
        header_1: zod_1.z.string().optional(),
        header_2: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        thumbnail: zod_1.z.string().optional(),
        status: zod_1.z.enum(['active', 'deactive']).optional(),
        publish: zod_1.z
            .object({ status: zod_1.z.string().optional(), time: zod_1.z.string().optional() })
            .optional(),
        publisher: zod_1.z.string({ required_error: 'publisher field is required' }),
        publisherName: zod_1.z.string({
            required_error: 'publisher Name field is required',
        }),
        tag: zod_1.z.array(zod_1.z.string().optional()).optional(),
    }),
});
const updateCourseZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        price: zod_1.z.number().optional(),
        header_1: zod_1.z.string().optional(),
        header_2: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        thumbnail: zod_1.z.string().optional(),
        status: zod_1.z.enum(['active', 'deactive']).optional(),
        publish: zod_1.z
            .object({ status: zod_1.z.boolean().optional(), time: zod_1.z.string().optional() })
            .optional(),
        publisher: zod_1.z.string().optional(),
        publisherName: zod_1.z.string().optional(),
        tag: zod_1.z.array(zod_1.z.string().optional()).optional(),
    }),
});
exports.CourseValidation = {
    createCourseZodSchema,
    updateCourseZodSchema,
};
