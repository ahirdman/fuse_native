import { z } from 'zod';

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
  name: z.string(),
});

export type User = z.infer<typeof User>;

const UserState = z.object({
  user: User.nullable(),
  token: SpotifyToken.nullable(),
});

export type UserState = z.infer<typeof UserState>;