import { captureException } from '@sentry/react-native';

import { supabase } from './supabase.init';

import type { IAuthInput } from '@/app/(auth)/sign-in';

export async function supabaseCreateAccount({ email, password }: IAuthInput) {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    captureException(error);
  }

  return data;
}

export async function supabaseSignIn({ email, password }: IAuthInput) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    captureException(error);
  }

  return data;
}

export async function supabaseSignOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    captureException(error);
  }
}

export async function supabaseResetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    captureException(error);
  }
}
