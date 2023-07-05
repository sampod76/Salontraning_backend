import { z } from 'zod';

const createLessionZodSchema = z.object({
  body: z.object({
    title: z.string().min(1, { message: 'Title is required' }).trim(),
    header_1: z.string().optional(),
    header_2: z.string().optional(),
    description: z.string().optional(),
    thumbnail: z.string().optional(),
    status: z.enum(['active', 'deactive']).optional(),
    course: z.string({ required_error: 'course id is required' }),
    courseId: z.string({ required_error: 'courseId is required' }),
    tag: z.array(z.string().optional()).optional(),
    vedio_link: z.string({ required_error: 'Vedio lini is required' }),
    duration: z.string().optional(),
  }),
});

const updateLessionZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    header_1: z.string().optional(),
    header_2: z.string().optional(),
    description: z.string().optional(),
    thumbnail: z.string().optional(),
    status: z.enum(['active', 'deactive']).optional(),
    course: z.string().optional(),
    courseId: z.string(),
    tag: z.array(z.string().optional()).optional(),
    vedio_link: z.string().optional(),
    duration: z.string().optional(),
  }),
});
export const LessionValidation = {
  createLessionZodSchema,
  updateLessionZodSchema,
};
