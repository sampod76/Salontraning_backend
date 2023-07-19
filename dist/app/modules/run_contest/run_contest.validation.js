"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunContestValidation = void 0;
const zod_1 = require("zod");
const createRunContestZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        header_1: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        // thumbnail: z.string().or(IFileUploadeSchema).optional(),
        status: zod_1.z.enum(['active', 'deactive', 'save']).optional(),
        winnerList: zod_1.z.array(zod_1.z.unknown()).optional(),
        // winnerPrize: z
        //   .array(
        //     z.object({
        //       title: z.string().optional(),
        //       thumbnail: z.string().optional(),
        //       prize_serial: z.number().optional(),
        //       prize_value: z.number().optional(),
        //     })
        //   )
        //   .optional(),
        winnerPrize: zod_1.z.array(zod_1.z.object({
            title: zod_1.z.string(),
            thumbnail: zod_1.z.string().optional(),
            prize_serial: zod_1.z.number(),
            prize_value: zod_1.z.number(),
        })),
        total_winer: zod_1.z.object({
            number: zod_1.z.number().min(0).optional(),
            condition: zod_1.z.object({}).optional(),
        }),
        duration_time: zod_1.z.object({
            startDate: zod_1.z.string(),
            endDate: zod_1.z.string(),
        }),
    }),
});
const updateRunContestZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        header_1: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        // thumbnail: z.string().or(IFileUploadeSchema).optional(),
        status: zod_1.z.enum(['active', 'deactive', 'save']).optional(),
        winnerList: zod_1.z.array(zod_1.z.unknown()).optional(),
        winnerPrize: zod_1.z.array(zod_1.z.unknown()).optional(),
        total_winer: zod_1.z.object({
            number: zod_1.z.number().min(0).optional(),
            condition: zod_1.z.object({}).optional(),
        }),
        duration_time: zod_1.z
            .object({
            startDate: zod_1.z.string().optional(),
            endDate: zod_1.z.string().optional(),
        })
            .optional(),
    }),
});
exports.RunContestValidation = {
    createRunContestZodSchema,
    updateRunContestZodSchema,
};
