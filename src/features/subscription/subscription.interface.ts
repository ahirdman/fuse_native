import { z } from 'zod';

const subscriptionPackageSchema = z.object({
  app_user_id: z.string(),
  expiration_date: z.string().datetime().nullable(),
  is_active: z.boolean(),
  is_sandbox: z.boolean(),
  product_id: z.string(),
  will_renew: z.boolean(),
});

export type SubscriptionPackage = z.infer<typeof subscriptionPackageSchema>;

export const subscriptionSchema = z.object({
  package: subscriptionPackageSchema.optional(),
  isSubscribed: z.boolean(),
});

export type AppSubscription = z.infer<typeof subscriptionSchema>;
