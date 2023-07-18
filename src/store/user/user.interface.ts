import { z } from 'zod';

const User = z.object({
  email: z.string(),
  name: z.string(),
});

export type User = z.infer<typeof User>;

const UserState = z.object({
  user: User.nullable(),
});

export type UserState = z.infer<typeof UserState>;
