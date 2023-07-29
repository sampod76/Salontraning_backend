import { z } from 'zod';

const createPhotoContestUserZodSchema = z.object({
  body: z.object({
    contest: z.string({ required_error: 'contest id is required' }),
    name: z.string({ required_error: 'name is required' }),
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
  }),
});

//create photo vote --loverect
const createPhotoContestVoteZodSchema = z.object({
  body: z.object({
    loveReact: z.enum(['yes', 'no']).optional(),
    // loveReact: z.string().optional().optional(),
    message: z.string().optional(),
    share: z.enum(['yes', 'no']).optional(),
  }),
});

//winner prize update
const updatePhotoContestUserWinner = z.object({
  body: z.object({
    winnerData: z
      .object({
        contest: z.string(),
        contest_number: z.string().optional(),
        date: z.string(),
        winner: z.number().nonnegative(),
      })
      .optional(),
  }),
});

export const PhotoContestUserValidation = {
  createPhotoContestUserZodSchema,
  updatePhotoContestUserZodSchema,
  updatePhotoContestUserWinner,
  createPhotoContestVoteZodSchema,
};
