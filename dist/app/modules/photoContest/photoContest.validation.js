"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoContestUserValidation = void 0;
const zod_1 = require("zod");
const createPhotoContestUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        header_1: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        thumbnail: zod_1.z.string({ required_error: 'thumbnail is required' }),
    }),
});
const updatePhotoContestUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        header_1: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        thumbnail: zod_1.z.string().optional(),
        status: zod_1.z.enum(['active', 'deactive']).optional(),
        loveReact: zod_1.z.array(zod_1.z.string()).optional(),
        message: zod_1.z
            .array(zod_1.z.object({
            userId: zod_1.z.string(),
            message: zod_1.z.string(),
        }))
            .optional(),
        share: zod_1.z.number().optional(),
    }),
});
const updatePhotoContestUserWinner = zod_1.z.object({
    body: zod_1.z.object({
        contest_id: zod_1.z.string(),
        winnerData: zod_1.z
            .object({
            date: zod_1.z.string(),
            winner: zod_1.z.number(),
        })
            .optional(),
    }),
});
exports.PhotoContestUserValidation = {
    createPhotoContestUserZodSchema,
    updatePhotoContestUserZodSchema,
    updatePhotoContestUserWinner,
};
