import { catchException } from '../sentry/sentry.exceptions';

import { supabase } from './supabase.init';

import type { SpotifyToken } from '@/store/user/user.interface';

interface InsertUserDataArgs {
  tokenData: SpotifyToken;
  refreshToken?: string;
  id: string;
}

export async function updateUserSpotifyData({
  tokenData,
  refreshToken,
  id,
}: InsertUserDataArgs) {
  //TOD: verify that undefined refresh token does not overwrite an existing refresh token
  const { data, error } = await supabase
    .from('users')
    .update({
      spotify_token_data: tokenData,
      spotify_refresh_token: refreshToken,
    })
    .eq('id', id)
    .select();

  if (error) {
    catchException(error);
  }

  return data;
}

interface UpdateUserSubscriptionDataArgs {
  isSubscribed: boolean;
  id: string;
}

export async function updateUserSubscriptionData({
  isSubscribed,
  id,
}: UpdateUserSubscriptionDataArgs) {
  const { data, error } = await supabase
    .from('users')
    .update({
      is_subscribed: isSubscribed,
    })
    .eq('id', id)
    .select();

  if (error) {
    catchException(error);
  }

  return data;
}

export async function selectUserData() {
  const { data, error } = await supabase.from('users').select('*');

  if (error) {
    throw new Error('No data');
  }

  if (!data.length) {
    return null;
  }

  return data[0];
}

export async function selecteUserSpotifyRefreshToken() {
  const { data, error } = await supabase
    .from('users')
    .select('spotify_refresh_token');

  if (error) {
    throw new Error('no refresh');
  }

  if (!data.length) {
    return null;
  }

  // @ts-ignore
  return data[0].spotify_refresh_token;
}
