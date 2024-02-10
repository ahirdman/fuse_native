import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { z } from 'zod';

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
export type SignInInput = z.infer<typeof signInInputSchema>;

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
export type SignUpInput = z.infer<typeof signUpInputSchema>;
export type SignUpRequest = Omit<SignUpInput, 'confirmPassword'>;

export const resetPasswordInputSchema = z.object({
  email: emailSchema,
});
export type ResetPasswordInput = z.infer<typeof resetPasswordInputSchema>;

export interface SupaBaseAuthRes {
  user: SupabaseUser;
  session: Session;
}
