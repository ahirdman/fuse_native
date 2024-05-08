import { useMutation } from '@tanstack/react-query';
import Purchases from 'react-native-purchases';
import { z } from 'zod';

import { supabase } from 'lib/supabase/supabase.init';

import {
  SpotifyToken,
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
    .single();

  if (profileError) {
    throw new Error(profileError.message);
  }

  const spotifyToken = spotifyTokenSchema.parse(userAccount.spotify_token_data); // WARN: This will not work
  const partialUserState: DeepTruePartial<UserState> = {
    user: {
      id: userData.user.id,
      email: userData.user.email,
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

  const parsedUserState = userStateSchema.required().parse(partialUserState);

  await Purchases.logIn(userData.user.id); // HACK: Figure out how to handle this

  return parsedUserState;
}

export const useSignIn = () =>
  useMutation({
    mutationFn: signInSupabase,
  });
