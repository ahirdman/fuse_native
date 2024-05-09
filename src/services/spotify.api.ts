import axios, { isAxiosError } from 'axios';
import { config } from 'config';
import * as AuthSession from 'expo-auth-session';

import { stringSchema } from 'schema';
import { store } from 'store';
import { showToast } from 'util/toast';

import { spotifyTokenSchema } from 'auth/auth.interface';
import { signOut, updateSpotifyToken } from 'auth/auth.slice';

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
        const currentRefreshToken = stringSchema.parse(
          store.getState().auth.spotifyToken?.refreshToken,
        );
        const request = await AuthSession.refreshAsync(
          {
            clientId: config.spotify.clientId,
            refreshToken: currentRefreshToken,
          },
          config.expoAuth.discovery,
        );

        const parsedToken = spotifyTokenSchema.parse(request);

        store.dispatch(
          updateSpotifyToken({
            accessToken: parsedToken.accessToken,
            expiresIn: parsedToken.expiresIn,
            issuedAt: parsedToken.issuedAt,
            refreshToken: parsedToken.refreshToken,
          }),
        );

        spotifyService.defaults.headers.common.Authorization = `Bearer ${parsedToken.accessToken}`;
      } catch (_e) {
        // WARN: Refersh token sometimes revoked, needs re-authorization
        store.dispatch(signOut());

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
