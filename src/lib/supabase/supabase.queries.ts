import { MakePurchaseRes } from '../subscription';
import { supabase } from './supabase.init';

import type { SpotifyToken } from '@/store/user/user.interface';

interface InsertUserDataArgs {
  tokenData: SpotifyToken;
  refreshToken?: string;
  spotifyUserId?: string | undefined;
}

export async function setSpotifyUserId({ id }: { id: string }) {
  const { error } = await supabase.from("users").upsert({ "spotify_user_id": id })

  if (error) {
    throw new Error("Could not upster spotify user id")
  }
}

export async function upsertUserSpotifyData({
  tokenData,
  refreshToken,
  spotifyUserId
}: InsertUserDataArgs) {
  //TODO: verify that undefined refresh token does not overwrite an existing refresh token
  const { data } = await supabase
    .from('users')
    .upsert({
      spotify_token_data: tokenData,
      spotify_refresh_token: refreshToken,
      spotify_user_id: spotifyUserId,
    })
    .select();

  return data;
}

export async function updateUserSubscriptionData({ activePackage, customer }: MakePurchaseRes) {
  const { data, error } = await supabase
    .from('subscriptions')
    .upsert({
      app_user_id: customer.originalAppUserId,
      expiration_date: activePackage.expirationDate,
      is_active: activePackage.isActive,
      is_sandbox: activePackage.isSandbox,
      product_id: activePackage.productIdentifier,
      will_renew: activePackage.willRenew
    })
    .select()
    .single()

  if (error || !data) {
    return { error: { message: "Error writing to subscriptions table " } }
  }

  const { error: userError } = await supabase.from("users").upsert({ subscription: data.id })

  if (userError) {
    return { error: { message: "Error writing to user table " } }
  }

  return data;
}

export async function selectUserData() {
  const { data, error } = await supabase
    .from('users')
    .select("*,subscriptions(*)")
    .single()

  if (error) {
    return undefined
  }

  return data;
}

export async function selecteUserSpotifyRefreshToken() {
  const { data, error } = await supabase
    .from('users')
    .select('spotify_refresh_token').single()

  if (error) {
    throw new Error('no refresh');
  }

  return data.spotify_refresh_token;
}
