import { z } from 'zod';

const createPhotoContestUserZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    header_1: z.string().optional(),
    description: z.string().optional(),
    thumbnail: z.string({ required_error: 'thumbnail is required' }),
  }),
});

const updatePhotoContestUserZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    header_1: z.string().optional(),
    description: z.string().optional(),
    thumbnail: z.string().optional(),
    status: z.enum(['active', 'deactive']).optional(),
    loveReact: z.array(z.string()).optional(),
    message: z
      .array(
        z.object({
          userId: z.string(),
          message: z.string(),
        })
      )
      .optional(),
    share: z.number().optional(),
  }),
});

const updatePhotoContestUserWinner = z.object({
  body: z.object({
    winnerData: z
      .object({
        contest_id: z.string(),
        contest_number: z.string().optional(),
        date: z.string(),
        winner: z.number(),
      })
      .optional(),
  }),
});
export const PhotoContestUserValidation = {
  createPhotoContestUserZodSchema,
  updatePhotoContestUserZodSchema,
  updatePhotoContestUserWinner,
};
