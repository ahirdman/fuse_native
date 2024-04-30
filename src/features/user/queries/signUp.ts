import { useMutation } from '@tanstack/react-query';
import { supabase } from 'lib/supabase/supabase.init';
import { z } from 'zod';

import { store } from 'store';

import type { Session, User } from '@supabase/supabase-js';
import { emailSchema, passwordSchema } from 'user/queries/signIn';
import { signIn } from 'user/user.slice';

const userNameSchmea = z
  .string()
  .min(2, { message: 'Username cannot be shorter than 2 characters' })
  .max(24, { message: 'Username cannot be longer than 24 characters' });

export const signUpInputSchema = z
  .object({
    email: emailSchema,
    userName: userNameSchmea,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    path: ['confirmPassword'],
    message: "Passwords don't match",
  });

export type SignUpInput = z.infer<typeof signUpInputSchema>;
export type SignUpArgs = Omit<SignUpInput, 'confirmPassword'>;

async function signUpSupabase({
  email,
  password,
  userName,
}: SignUpArgs): Promise<{ user: User; session: Session }> {
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name: userName } },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (data.session && data.user) {
    return data as { user: User; session: Session };
  }

  throw new Error('Something went wrong, session was null');
}

export const useSignUp = () =>
  useMutation({
    mutationFn: signUpSupabase,
    onSuccess: (data) => {
      store.dispatch(signIn({ id: data.user.id, email: data.user.email }));
    },
  });
