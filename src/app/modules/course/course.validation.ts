import { z } from 'zod';
import { COURSE_TYPES } from './course.consent';

const createCourseZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'title field is required' }),
    price: z.number().nonnegative().optional(),
    type: z.enum([...COURSE_TYPES] as [string, ...string[]]),
    category: z.string().optional(),
    discount: z.number().nonnegative().max(100).optional(),
    vat: z.number().nonnegative().optional(),
    header_1: z.string().optional(),
    header_2: z.string().optional(),
    description: z.string().optional(),
    thumbnail: z.string().optional(),
    status: z.enum(['active', 'deactive']).optional(),
    publish: z
      .object({ status: z.string().optional(), time: z.string().optional() })
      .optional(), // Assuming publish is a string representing the ID of a related document
    publisher: z.string({ required_error: 'publisher field is required' }), // Assuming publisher is a string representing the ID of a related document
    publisherName: z.string({
      required_error: 'publisher Name field is required',
    }),
    tag: z.array(z.string().optional()).optional(),
  }),
});

const updateCourseZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    price: z.number().optional(),
    type: z.enum([...COURSE_TYPES] as [string, ...string[]]).optional(),
    category: z.string().optional(),
    header_1: z.string().optional(),
    header_2: z.string().optional(),
    description: z.string().optional(),
    thumbnail: z.string().optional(),
    status: z.enum(['active', 'deactive']).optional(),
    publish: z
      .object({ status: z.boolean().optional(), time: z.string().optional() })
      .optional(), // Assuming publish is a string representing the ID of a related document
    publisher: z.string().optional(), // Assuming publisher is a string representing the ID of a related document
    publisherName: z.string().optional(),
    tag: z.array(z.string().optional()).optional(),
  }),
});
export const CourseValidation = {
  createCourseZodSchema,
  updateCourseZodSchema,
};
