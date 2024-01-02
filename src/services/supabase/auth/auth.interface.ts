import { z } from 'zod';

import type { Session, User as SupabaseUser } from '@supabase/supabase-js';

export const emailSchema = z.string().email({ message: 'Invalid Email' });

export const passwordSchema = z
  .string()
  .min(6, {
    message: 'Password cannot be shorter than 6 characters',
  })
  .max(72, { message: 'Password cannot be longer than 72 characters' });

export const signInInputSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signUpInputSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    path: ['confirmPassword'],
    message: "Passwords don't match",
  });

export const resetPasswordInputSchema = z.object({
  email: emailSchema,
});

export type SignInInput = z.infer<typeof signInInputSchema>;

export type SignUpInput = z.infer<typeof signUpInputSchema>;

export type SignUpRequest = Omit<SignUpInput, 'confirmPassword'>;

export type ResetPasswordInput = z.infer<typeof resetPasswordInputSchema>;

export interface SupaBaseAuthRes {
  user: SupabaseUser;
  session: Session;
}

export const CustomerQueryError = z.object({
  error: z.object({
    data: z.object({
      message: z.string(),
    }),
    status: z.number(),
  }),
});

export type CustomerQueryError = z.infer<typeof CustomerQueryError>;
