import { z } from 'zod';

const createCourseZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'title field is required' }),
    price: z.number().optional(),
    header_1: z.string().optional(),
    header_2: z.string().optional(),
    description: z.string().optional(),
    thimble: z.string().optional(),
    status: z.enum(['active', 'deactive']).optional(),
    publish: z
      .object({ status: z.boolean().optional(), time: z.string().optional() })
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
    header_1: z.string().optional(),
    header_2: z.string().optional(),
    description: z.string().optional(),
    thimble: z.string().optional(),
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
