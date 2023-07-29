import { z } from 'zod';

const createRunContestZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    header_1: z.string().optional(),
    description: z.string().optional(),
    thumbnail: z.string().optional(),
    status: z.enum(['active', 'deactive', 'save']).optional(),
    winnerList: z.array(z.unknown()).optional(),

    winnerPrize: z.array(
      z.object({
        title: z.string(),
        thumbnail: z.string().optional(),
        prize_serial: z.number(),
        prize_value: z.number(),
      })
    ),
    total_winer: z.object({
      number: z.number().min(0).optional(),
      condition: z.object({}).optional(),
    }),
    duration_time: z.object({
      startDate: z.string(),
      endDate: z.string(),
    }),
  }),
});

const updateRunContestZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    header_1: z.string().optional(),
    description: z.string().optional(),
    thumbnail: z.string().optional(),
    status: z.enum(['active', 'deactive', 'save']).optional(),
    winnerList: z
      .array(
        z.object({
          photo_contest_id: z.string({
            required_error: 'photo contest id required',
          }),
          userId: z.string({ required_error: 'user id required' }),
          email: z.string().optional(),
          name: z.string().optional(),
          phone: z.string().optional(),
        })
      )
      .optional(),
    winnerPrize: z.array(z.unknown()).optional(),
    total_winer: z
      .object({
        number: z.number().min(0).optional(),
        condition: z.object({}).optional(),
      })
      .optional(),
    duration_time: z
      .object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
      .optional(),
  }),
});

export const RunContestValidation = {
  createRunContestZodSchema,
  updateRunContestZodSchema,
};
