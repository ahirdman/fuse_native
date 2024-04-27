import { supabase } from 'lib/supabase/supabase.init';
import type { SpotifyToken } from 'user/user.interface';

interface InsertUserDataArgs {
  tokenData: SpotifyToken;
  refreshToken?: string;
  spotifyUserId?: string | undefined;
}

export async function upsertUserSpotifyData({
  tokenData,
  refreshToken,
  spotifyUserId,
}: InsertUserDataArgs) {
  //TODO: verify that undefined refresh token does not overwrite an existing refresh token
  const { data, error } = await supabase
    .from('users')
    .upsert({
      spotify_token_data: tokenData,
      spotify_refresh_token: refreshToken,
      spotify_user_id: spotifyUserId,
    })
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
