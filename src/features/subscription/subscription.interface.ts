import { z } from 'zod';

export const subscriptionSchema = z.object({
  appUserId: z.string(),
  expirationDate: z.coerce
    .date()
    .nullable()
    .transform((val) => (val !== null ? val.toString() : null)),
  isActive: z.boolean(),
  isSandbox: z.boolean(),
  productId: z.string(),
  willRenew: z.boolean(),
});

export type AppSubscription = z.infer<typeof subscriptionSchema>;
