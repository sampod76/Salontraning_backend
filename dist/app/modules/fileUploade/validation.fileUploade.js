"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadeValidation = void 0;
const zod_1 = require("zod");
const createFileUploadezodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        path: zod_1.z.string().optional(),
        category: zod_1.z.string().optional(),
        tag: zod_1.z.array(zod_1.z.string().optional()).optional(),
    }),
});
const updateFileUploadezodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        path: zod_1.z.string().optional(),
        category: zod_1.z.string().optional(),
        tag: zod_1.z.array(zod_1.z.string().optional()).optional(),
    }),
});
exports.FileUploadeValidation = {
    createFileUploadezodSchema,
    updateFileUploadezodSchema,
};
