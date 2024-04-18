import z from 'zod';

const IPaymentSchema = z
  .object({
    method: z.string().trim().optional(),
    method_TransactionID: z.string().trim().optional(),
    paymentType: z.string().optional(),
    productId: z.string().optional(),
    revenueCatId: z.string().optional(),
  })
  .optional();

const cteateZodPurchasedCoursesSchema = z.object({
  body: z.object({
    userId: z.string().nonempty({ message: 'User ID is required' }),
    userName: z.string().trim().nonempty({ message: 'User name is required' }),
    email: z.string().trim().email().optional(),
    phone: z.string().trim().optional(),
    payment: IPaymentSchema,
    transactionID: z.string().optional(),
    course: z.string().nonempty({ message: 'Course _id is required' }),
    courseId: z.string().trim().optional(),
  }),
});

// *************** update ********************
const IPaymentSchemaUpdate = z
  .object({
    price: z
      .number()
      .nonnegative({ message: 'price must be a non-negative number' })
      .optional(),
    vat: z.number().optional(),
    discount: z.number().optional(),
    total: z
      .number()
      .nonnegative({ message: 'Total must be a non-negative number' })
      .optional(),
    method: z.string().trim().optional(),
    method_TransactionID: z.string().trim().optional(),
    productId: z.string().optional(),
    revenueCatId: z.string().optional(),
  })
  .optional();

const updateZodPurchasedCoursesSchema = z.object({
  body: z.object({
    userId: z.string().optional(),
    userName: z.string().trim().optional(),
    email: z.string().trim().email().optional(),
    phone: z.string().trim().optional(),
    payment: IPaymentSchemaUpdate.optional(),
    transactionID: z.string().optional(),
    course: z.string().optional(),
    courseId: z.string().optional(),
  }),
});

export const PurchasedCoursesValidation = {
  cteateZodPurchasedCoursesSchema,
  updateZodPurchasedCoursesSchema,
};
