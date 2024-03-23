import axios from 'axios';

import { isAxiosError } from 'axios';
import { config } from 'config';
import * as AuthSession from 'expo-auth-session';

import { supabase } from 'lib/supabase/supabase.init';
import { store } from 'store';
import { showToast } from 'util/toast';

import { signOutSupabase } from 'user/queries/signOut';
import { upsertUserSpotifyData as upsertDbSpotifyData } from 'user/queries/updateSpotifyCredentials';
import { updateSpotifyToken } from 'user/user.slice';

export const spotifyService = axios.create({
  baseURL: config.spotify.baseUrl,
  timeout: 1000,
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
        const currentRefreshToken = await getDbSpotifyRefreshToken();

        const request = await AuthSession.refreshAsync(
          {
            clientId: config.spotify.clientId,
            refreshToken: currentRefreshToken,
          },
          config.expoAuth.discovery,
        );

        const {
          refreshToken,
          accessToken,
          tokenType,
          expiresIn,
          scope,
          issuedAt,
        } = request;

        store.dispatch(
          updateSpotifyToken({
            accessToken,
            tokenType,
            expiresIn,
            scope,
            issuedAt,
          }),
        );

        await upsertDbSpotifyData({
          tokenData: { accessToken, tokenType, expiresIn, scope, issuedAt },
          refreshToken,
        });

        spotifyService.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      } catch (_e) {
        //TODO: Refersh token sometimes revoked, needs re-authorization
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
    .from('users')
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
