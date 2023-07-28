import { catchException } from '../sentry/sentry.exceptions';

import { supabase } from './supabase.init';

import type { SpotifyToken } from '@/store/user/user.interface';

interface InsertUserDataArgs {
  tokenData: SpotifyToken;
  refreshToken: string;
  id: string;
}

export async function updateUserSpotifyData({
  tokenData,
  refreshToken,
  id,
}: InsertUserDataArgs) {
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
