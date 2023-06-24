import { z } from 'zod';

const updateModeratorZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    dateOfBirth: z.string().optional(),
    gender: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    emergencyphone: z.string().optional(),
    address: z.string().optional(),
    designation: z.string().optional(),
    status: z.enum(['active', 'deactive']).optional(),
    otherInfo: z
      .object({ uid: z.string().optional(), photoURL: z.string().optional() })
      .optional(),
  }),
});

export const ModeratorValidation = {
  updateModeratorZodSchema,
};
