import { captureException } from '@sentry/react-native';

import { supabase } from './supabase.init';

import type { IAuthInput } from '@/app/(auth)/auth';

export async function supabaseCreateAccount({ email, password }: IAuthInput) {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    captureException(error);
  }

  return data;
}

export async function signInWithSpotify() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'spotify',
    options: {
      skipBrowserRedirect: true,
      scopes: 'user-read-email',
    },
  });

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
