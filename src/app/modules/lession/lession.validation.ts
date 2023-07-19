import { z } from 'zod';

const createLessionZodSchema = z.object({
  body: z.object({
    title: z.string().min(1, { message: 'Title is required' }).trim(),
    vedio: z.object({ link: z.string(), player_no: z.number() }),
    serial_no: z.number().optional(),
    duration: z.number().optional(),
    course: z.string({ required_error: 'course id is required' }),
    courseId: z.string({ required_error: 'courseId is required' }),
    //
    //
    courseTitle: z.string().optional(),
    header_1: z.string().optional(),
    header_2: z.string().optional(),
    description: z.string().optional(),
    thumbnail: z.string().optional(),
    status: z.enum(['active', 'deactive', 'save']).optional(),
    tag: z.array(z.string().optional()).optional(),
  }),
});

const updateLessionZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    courseTitle: z.string().optional(),
    header_1: z.string().optional(),
    header_2: z.string().optional(),
    description: z.string().optional(),
    thumbnail: z.string().optional(),
    status: z.enum(['active', 'deactive', 'save']).optional(),
    course: z.string().optional(),
    courseId: z.string(),
    tag: z.array(z.string().optional()).optional(),
    vedio: z
      .object({ link: z.string().optional(), player_no: z.number().optional() })
      .optional(),
    serial_no: z.number().optional(),
    duration: z.number().optional(),
  }),
});
export const LessionValidation = {
  createLessionZodSchema,
  updateLessionZodSchema,
};
