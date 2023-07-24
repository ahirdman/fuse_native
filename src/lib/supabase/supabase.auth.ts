import { captureException } from '@sentry/react-native';

import { supabase } from './supabase.init';

import type {
  AuthError,
  AuthResponse,
  AuthTokenResponse,
} from '@supabase/supabase-js';
import type { ISignIn } from '@/app/(auth)/sign-in';

export async function supabaseCreateAccount({
  email,
  password,
}: ISignIn): Promise<AuthResponse> {
  const result = await supabase.auth.signUp({ email, password });

  return result;
}

export async function supabaseSignIn({
  email,
  password,
}: ISignIn): Promise<AuthTokenResponse> {
  const result = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return result;
}

export async function supabaseSignOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    captureException(error);
  }
}

export async function supabaseResetPassword(
  email: string,
): Promise<AuthError | null> {
  const { error } = await supabase.auth.resetPasswordForEmail(email);

  return error;
}
