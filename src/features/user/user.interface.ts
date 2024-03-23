import { z } from 'zod';

import { subscriptionSchema } from 'subscription/subscription.interface';

export const spotifyTokenSchema = z.object({
  accessToken: z.string(),
  tokenType: z.string(),
  expiresIn: z.number().optional(),
  scope: z.string().optional(),
  idToken: z.string().optional(),
  issuedAt: z.number().optional(),
});

export type SpotifyToken = z.infer<typeof spotifyTokenSchema>;

const userSchema = z.object({
  id: z.string(),
  email: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;

const spotifyUserSchema = z.object({
  id: z.string(),
});

export type SpotifyUser = z.infer<typeof spotifyUserSchema>;

const userStateSchema = z.object({
  user: userSchema.optional(),
  spotifyToken: spotifyTokenSchema.optional(),
  subscription: subscriptionSchema.optional(),
  spotifyUser: spotifyUserSchema.optional(),
});

export type UserState = z.infer<typeof userStateSchema>;
