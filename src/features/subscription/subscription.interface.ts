import { z } from 'zod';

export const subscriptionSchema = z.object({
  appUserId: z.string(),
  expirationDate: z.string().datetime().nullable(),
  isActive: z.boolean(),
  isSandbox: z.boolean(),
  productId: z.string(),
  willRenew: z.boolean(),
});

export type AppSubscription = z.infer<typeof subscriptionSchema>;
