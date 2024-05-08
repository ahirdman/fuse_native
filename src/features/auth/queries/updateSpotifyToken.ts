import { supabase } from 'lib/supabase/supabase.init';

import type { SpotifyToken } from 'auth/auth.interface';

interface UpdateSpotifyTokenArgs {
  tokenData: SpotifyToken;
  userId: string;
}

export async function updateSpotifyToken({
  tokenData,
  userId,
}: UpdateSpotifyTokenArgs): Promise<void> {
  const { refreshToken, ...tokenResponse } = tokenData;

  const { error } = await supabase
    .from('accounts')
    .update({
      spotify_token_data: tokenResponse,
      spotify_refresh_token: refreshToken,
    })
    .eq('id', userId);

  if (error) {
    throw new Error(error.message);
  }
}
