import axios, { isAxiosError } from 'axios';
import { TokenResponse } from 'expo-auth-session';

import { config } from 'config';
import { authorizeSpotify } from 'lib/expo/expo.auth';
import { store } from 'store';
import { showToast } from 'util/toast';

import { spotifyTokenSchema } from 'auth/auth.interface';
import {
  signOut,
  updateSpotifyToken as updateTokenState,
} from 'auth/auth.slice';

export const spotifyService = axios.create({
  baseURL: config.spotify.baseUrl,
  timeout: 10000,
});

spotifyService.interceptors.request.use(async (request) => {
  const controller = new AbortController();
  const { spotifyToken } = store.getState().auth;
  const authHeader = request.headers.get("Authorization")

  if (authHeader) {
    return request
  }

  if (!spotifyToken) {
    throw new Error('State is not properly hydrated');
  }

  try {
    const currentToken = new TokenResponse(spotifyToken);
    const tokenNeedsRefresh = currentToken.shouldRefresh();

    if (tokenNeedsRefresh) {
      const refreshedToken = await currentToken.refreshAsync(
        {
          clientId: config.spotify.clientId,
        },
        { tokenEndpoint: config.expoAuth.discovery.tokenEndpoint },
      );

      const parsedToken = spotifyTokenSchema.parse(refreshedToken);
      store.dispatch(updateTokenState(parsedToken));

      request.headers.set('Authorization', `Bearer ${parsedToken.accessToken}`);
    } else {
      request.headers.set(
        'Authorization',
        `Bearer ${currentToken.accessToken}`,
      );
    }

    return request;
  } catch (error) {
    function abortAndClear() {
      store.dispatch(signOut());

      controller.abort(error);
      request.headers.clear('Authorization');

      return {
        ...request,
        signal: controller.signal,
      };
    }

    if (!isSpotifyGrantError(error)) {
      return abortAndClear();
    }

    const newRefreshToken = await authorizeSpotify();
    // NOTE: Could be a little confising
    // - Consider showing an alert or other pop up
    //   describing why the user needs to authorize again

    if (!newRefreshToken) {
      return abortAndClear();
    }

    const parsedToken = spotifyTokenSchema.parse(newRefreshToken);
    store.dispatch(updateTokenState(parsedToken));
    request.headers.set(
      'Authorization',
      `Bearer ${newRefreshToken.accessToken}`,
    );

    return request;
  }
});

spotifyService.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    if (!isAxiosError(error)) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      store.dispatch(signOut());
      spotifyService.defaults.headers.common.Authorization = undefined;

      showToast({
        title: 'Something went wrong',
        preset: 'error',
        message: 'Refreshing Spotify token did not work...',
      });
    } else {
      return Promise.reject(error);
    }
  },
);

function isSpotifyGrantError(error: unknown): boolean {
  if (error && typeof error === 'object' && 'code' in error) {
    return error.code === 'invalid_grant';
  }

  return false;
}
