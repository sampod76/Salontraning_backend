import { z } from 'zod';
import { GENDER } from './constant.GeneralUser';

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
  }),
});

const createGeneralUserByFirebaseZodSchema = z.object({
  body: z.object({
    name: z.string(),
    gender: z.enum([...GENDER] as [string, ...string[]]).optional(),
    dateOfBirth: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    profileImage: z.string().optional(),
    uid: z.string(),
    status: z.enum(['active', 'deactive']).optional(),
  }),
});

export const GeneralUserValidation = {
  updateGeneralUserZodSchema,
  createGeneralUserByFirebaseZodSchema,
};
