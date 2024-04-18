import { z } from 'zod';

const createNotificationZodSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: 'Title is required',
      })
      .max(200),
    body: z
      .string({
        required_error: 'Message is required',
      })
      .max(1000),
    subTitle: z.string().max(200).optional(),
    icon: z.string().max(200).optional(),
    thumbnail: z.string().max(200).optional(),
    status: z.string().max(200).optional(),
    users: z.array(z.string().max(200).optional()),
  }),
});
const updateNotificationZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    thumbnail: z.string().optional(),
    status: z.string().optional(),
  }),
});

export const NotificationValidation = {
  createNotificationZodSchema,
  updateNotificationZodSchema,
};
