import { z } from 'zod';

const createRunContestZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    header_1: z.string().optional(),
    description: z.string().optional(),
    // thumbnail: z.string().or(IFileUploadeSchema).optional(),
    status: z.enum(['active', 'deactive', 'save']).optional(),
    winnerList: z.array(z.unknown()).optional(),
    winnerPrice: z.array(z.unknown()).optional(),
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
    // thumbnail: z.string().or(IFileUploadeSchema).optional(),
    status: z.enum(['active', 'deactive', 'save']).optional(),
    winnerList: z.array(z.unknown()).optional(),
    winnerPrice: z.array(z.unknown()).optional(),
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
