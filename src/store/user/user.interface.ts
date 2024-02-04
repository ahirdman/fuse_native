import { z } from 'zod';

const subscriptionPackage = z.object({
  app_user_id: z.string(),
  expiration_date: z.string().datetime().nullable(),
  is_active: z.boolean(),
  is_sandbox: z.boolean(),
  product_id: z.string(),
  will_renew: z.boolean(),
});
export type SubscriptionPackage = z.infer<typeof subscriptionPackage>;

const subscription = z.object({
  package: subscriptionPackage.optional(),
  isSubscribed: z.boolean(),
});
export type AppSubscription = z.infer<typeof subscription>;

export const spotifyToken = z.object({
  accessToken: z.string(),
  tokenType: z.string(),
  expiresIn: z.number().optional(),
  scope: z.string().optional(),
  idToken: z.string().optional(),
  issuedAt: z.number().optional(),
});
export type SpotifyToken = z.infer<typeof spotifyToken>;

const user = z.object({
  id: z.string(),
  email: z.string().optional(),
});
export type User = z.infer<typeof user>;

const spotifyUser = z.object({
  id: z.string(),
});
export type SpotifyUser = z.infer<typeof spotifyUser>;

const userState = z.object({
  user: user.optional(),
  spotifyToken: spotifyToken.optional(),
  subscription: subscription.optional(),
  spotifyUser: spotifyUser.optional(),
});
export type UserState = z.infer<typeof userState>;
