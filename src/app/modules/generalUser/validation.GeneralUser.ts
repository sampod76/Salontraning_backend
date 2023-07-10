import { z } from 'zod';
import { GENDER } from './constant.GeneralUser';

const createGeneralUserByFirebaseZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    gender: z.enum([...GENDER] as [string, ...string[]]).optional(),
    dateOfBirth: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    profileImage: z.string().optional(),
    uid: z.string().optional(),
    status: z.enum(['active', 'deactive']).optional(),
  }),
});

const updateGeneralUserZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    gender: z.enum([...GENDER] as [string, ...string[]]).optional(),
    dateOfBirth: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    profileImage: z.string().optional(),
    status: z.enum(['active', 'deactive']).optional(),
    learnedToday: z
      .object({
        date: z.string().optional(),
        time: z.number().optional(),
      })
      .optional(),
  }),
});

// const updateCourseOrQuizZodSchema = z.object({
//   body: z.object({
//     purchase_courses: z
//       .array(
//         z
//           .object({
//             total_completed_lessions: z
//               .array(
//                 z
//                   .string()
//                   .refine(val => Types.ObjectId.isValid(val), {
//                     message: 'Invalid Video ID',
//                   })
//                   .optional()
//               )
//               .optional(),
//           })
//           .optional()
//       )
//       .optional(),
//   }),
// });

export const GeneralUserValidation = {
  updateGeneralUserZodSchema,
  createGeneralUserByFirebaseZodSchema,
};
