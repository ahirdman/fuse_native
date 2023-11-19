import { z } from 'zod';

const Subscription = z.object({
  subscribed: z.boolean(),
});

export type Subscription = z.infer<typeof Subscription>;

const SpotifyToken = z.object({
  accessToken: z.string(),
  tokenType: z.string(),
  expiresIn: z.number().optional(),
  scope: z.string().optional(),
  idToken: z.string().optional(),
  issuedAt: z.number().optional(),
});

export type SpotifyToken = z.infer<typeof SpotifyToken>;

const User = z.object({
  id: z.string(),
});

export type User = z.infer<typeof User>;

const UserState = z.object({
  user: User.optional(),
  token: SpotifyToken.optional(),
  subscription: Subscription.optional(),
});

export type UserState = z.infer<typeof UserState>;
