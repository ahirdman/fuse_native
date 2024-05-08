import axios, { isAxiosError } from 'axios';
import { config } from 'config';
import * as AuthSession from 'expo-auth-session';

import { supabase } from 'lib/supabase/supabase.init';
import { store } from 'store';
import { showToast } from 'util/toast';

import { spotifyTokenSchema } from 'auth/auth.interface';
import { updateSpotifyToken } from 'auth/auth.slice';
import { signOutSupabase } from 'auth/queries/signOut';
import { updateSpotifyToken as updateSpotifyTokenDb } from 'auth/queries/updateSpotifyToken';
import { stringSchema } from 'schemas';

export const spotifyService = axios.create({
  baseURL: config.spotify.baseUrl,
  timeout: 10000,
});

spotifyService.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (!isAxiosError(error)) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      try {
        const userId = stringSchema.parse(store.getState().auth.user?.id);
        const currentRefreshToken = await getDbSpotifyRefreshToken(); // TODO: Get from local storage
        const request = await AuthSession.refreshAsync(
          {
            clientId: config.spotify.clientId,
            refreshToken: currentRefreshToken,
          },
          config.expoAuth.discovery,
        );

        const parsedToken = spotifyTokenSchema.parse(request);

        store.dispatch(
          // TODO: Just store in local storage
          updateSpotifyToken({
            accessToken: parsedToken.accessToken,
            expiresIn: parsedToken.expiresIn,
            issuedAt: parsedToken.issuedAt,
            refreshToken: parsedToken.refreshToken,
          }),
        );

        await updateSpotifyTokenDb({ tokenData: parsedToken, userId });

        spotifyService.defaults.headers.common.Authorization = `Bearer ${parsedToken.accessToken}`;
      } catch (_e) {
        // WARN: Refersh token sometimes revoked, needs re-authorization
        await signOutSupabase();

        spotifyService.defaults.headers.common.Authorization = undefined;

        showToast({
          title: 'Something went wrong',
          preset: 'error',
          message: 'Refreshing Spotify token did not work...',
        });

        return Promise.reject(error);
      }
    } else {
      return Promise.reject(error);
    }
  },
);

async function getDbSpotifyRefreshToken(): Promise<string> {
  const { data, error } = await supabase
    .from('accounts')
    .select('spotify_refresh_token')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data.spotify_refresh_token) {
    throw new Error('No spotify refresh token in database');
  }

  return data.spotify_refresh_token;
}
