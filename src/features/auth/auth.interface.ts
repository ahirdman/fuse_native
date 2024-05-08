import { z } from 'zod';

import { subscriptionSchema } from 'subscription/subscription.interface';

export const spotifyTokenSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number(),
  issuedAt: z.number(),
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

export const profileSchema = z.object({
  username: z
    .string()
    .min(2, { message: 'Username cannot be shorter than 2 characters' })
    .max(24, { message: 'Username cannot be longer than 24 characters' }),
  avatarUrl: z.string().optional(),
});

export type Profile = z.infer<typeof profileSchema>;

export const userStateSchema = z.object({
  user: userSchema,
  profile: profileSchema,
  spotifyToken: spotifyTokenSchema,
  subscription: subscriptionSchema,
  spotifyUser: spotifyUserSchema,
});

export type UserState = z.infer<typeof userStateSchema>;
