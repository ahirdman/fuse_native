import { supabase } from 'lib/supabase/supabase.init';

import type { SpotifyToken } from 'auth/auth.interface';

async function upsertSpotifyToken(tokenData: SpotifyToken): Promise<void> {
  const { refreshToken, ...tokenResponse } = tokenData;

  const { error } = await supabase.from('accounts').upsert({
    spotify_token_data: tokenResponse,
    spotify_refresh_token: refreshToken,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export { upsertSpotifyToken };
