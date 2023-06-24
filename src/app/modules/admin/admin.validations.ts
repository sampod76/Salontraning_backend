import { z } from 'zod';

const updateAdminZodSchema = z.object({
  body: z.object({
    name: z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
    }),
    dateOfBirth: z.string().optional(),
    gender: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    emergencyphone: z.string().optional(),
    address: z.string().optional(),
    designation: z.string().optional(),
  }),
});

export const AdminValidation = {
  updateAdminZodSchema,
};
