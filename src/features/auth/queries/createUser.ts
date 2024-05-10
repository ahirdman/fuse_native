import type { Session, User } from '@supabase/supabase-js';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { supabase } from 'lib/supabase/supabase.init';

import { emailSchema, passwordSchema } from 'auth/queries/signIn';

export const createUserSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    path: ['confirmPassword'],
    message: "Passwords don't match",
  });

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type CreateUserArgs = Omit<CreateUserInput, 'confirmPassword'>;

async function createUser({
  email,
  password,
}: CreateUserArgs): Promise<{ user: User; session: Session }> {
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw error
  }

  if (data.session && data.user) {
    return data as { user: User; session: Session };
  }

  throw new Error('Something went wrong, session was null');
}

export const useCreateUser = () =>
  useMutation({
    mutationFn: createUser,
  });
