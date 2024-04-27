import type { ThunkDispatch } from '@reduxjs/toolkit';
import type { Session } from '@supabase/supabase-js';
import { useMutation } from '@tanstack/react-query';
import Purchases from 'react-native-purchases';
import { z } from 'zod';

import { supabase } from 'lib/supabase/supabase.init';
import { store } from 'store';

import { spotifyService } from 'services/spotify.api';
import { type UserState, spotifyTokenSchema } from 'user/user.interface';
import { hydrateAuthState, signIn, signOut } from 'user/user.slice';
import { showToast } from 'util/toast';

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

async function signInSupabase({ email, password }: SignInInput) {
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const useSignIn = () =>
  useMutation({
    mutationFn: signInSupabase,
    onSuccess: async (data) => {
      await handleAuthStateSignIn(data.session, store.dispatch);
    },
  });

export async function handleAuthStateSignIn(
  session: Session,
  // biome-ignore lint/suspicious/noExplicitAny: reason
  dispatch: ThunkDispatch<any, any, any>,
) {
  try {
    await Purchases.logIn(session.user.id);
    const dbUserData = await selectUserData();

    if (!dbUserData) {
      dispatch(signIn({ id: session.user.id, email: session.user.email }));
      return;
    }

    const userState: UserState = {
      user: { id: session.user.id, email: session.user.email },
    };

    const parsedSpotifyToken = spotifyTokenSchema.safeParse(
      dbUserData.spotify_token_data,
    );

    if (parsedSpotifyToken.success) {
      userState.spotifyToken = parsedSpotifyToken.data;
      spotifyService.defaults.headers.common.Authorization = `Bearer ${parsedSpotifyToken.data.accessToken}`;
    }

    if (dbUserData.spotify_user_id) {
      userState.spotifyUser = { id: dbUserData.spotify_user_id };
    }

    if (dbUserData.subscription && dbUserData.subscriptions) {
      userState.subscription = {
        isSubscribed: true,
        package: {
          ...dbUserData.subscriptions,
          app_user_id: dbUserData.subscriptions.app_user_id ?? 'Unknwon',
        },
      };
    }

    dispatch(hydrateAuthState(userState));
  } catch (_error) {
    dispatch(signOut());

    showToast({
      title: 'We could not get your user data',
      preset: 'error',
    });
  }
}

async function selectUserData() {
  const { data, error } = await supabase
    .from('users')
    .select('*,subscriptions(*)')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
