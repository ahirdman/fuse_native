import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { supabase } from 'lib/supabase/supabase.init';

import {
  type UserState,
  spotifyTokenSchema,
  userStateSchema,
} from 'auth/auth.interface';
import type { DeepTruePartial } from 'types';

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

const spotifyTokenJsonSchema = z.object({
  issuedAt: z.number(),
  expiresIn: z.number(),
  accessToken: z.string(),
});

export type SignInInput = z.infer<typeof signInInputSchema>;

async function signInSupabase({
  email,
  password,
}: SignInInput): Promise<Required<UserState>> {
  const { error: signInError, data: userData } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (signInError) {
    throw signInError;
  }

  const { error: accountError, data: userAccount } = await supabase
    .from('accounts')
    .select('*,subscriptions(*)')
    .single();

  if (accountError) {
    throw new Error(accountError.message);
  }

  const { error: profileError, data: userProfile } = await supabase
    .from('profiles')
    .select()
    .eq('id', userData.user.id)
    .single();

  if (profileError) {
    throw new Error(profileError.message);
  }

  const refreshToken = userAccount.spotify_refresh_token;
  const tokenData = spotifyTokenJsonSchema.parse(
    userAccount.spotify_token_data,
  );
  const spotifyToken = spotifyTokenSchema.parse({ ...tokenData, refreshToken });

  const partialUserState: DeepTruePartial<UserState> = {
    user: {
      id: userData.user.id,
      email: userData.user.email,
      pushToken: userAccount.pushToken ?? undefined,
    },
    profile: {
      username: userProfile.name,
      avatarUrl: userProfile.avatar_url,
    },
    spotifyUser: {
      id: userAccount.spotify_user_id,
    },
    spotifyToken,
    subscription: {
      appUserId: userAccount.subscriptions?.app_user_id,
      expirationDate: userAccount.subscriptions?.expiration_date,
      isActive: userAccount.subscriptions?.is_active,
      isSandbox: userAccount.subscriptions?.is_sandbox,
      productId: userAccount.subscriptions?.product_id,
      willRenew: userAccount.subscriptions?.will_renew,
    },
  };

  const parsedUserState = userStateSchema.parse(partialUserState);

  return parsedUserState;
}

export const useSignIn = () =>
  useMutation({
    mutationFn: signInSupabase,
  });
