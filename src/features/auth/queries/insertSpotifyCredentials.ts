import { supabase } from 'lib/supabase/supabase.init';

import type { SpotifyToken, SpotifyUser } from 'auth/auth.interface';

interface InsertSpotifyCredentialsArgs {
  tokenData: SpotifyToken;
  spotifyUser: SpotifyUser;
}

export async function insertSpotifyCredentials({
  tokenData,
  spotifyUser,
}: InsertSpotifyCredentialsArgs): Promise<void> {
  const { refreshToken, ...tokenResponse } = tokenData;

  const { error } = await supabase.from('accounts').insert({
    spotify_token_data: tokenResponse,
    spotify_refresh_token: refreshToken,
    spotify_user_id: spotifyUser.id,
  });

  if (error) {
    throw new Error(error.message);
  }
}
