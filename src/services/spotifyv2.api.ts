import axios, { AxiosError } from 'axios';
import { config } from 'config';
import * as AuthSession from 'expo-auth-session';
import { store } from 'store';
import {
  selecteUserSpotifyRefreshToken,
  upsertUserSpotifyData,
} from 'user/queries';
import { authApi } from 'user/queries/auth.endpoints';
import { updateSpotifyToken } from 'user/user.slice';
import { assertIsDefined } from 'util/assert';
import { showToast } from 'util/toast';

const spotifyService = axios.create({
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
        const currentRefreshToken = await selecteUserSpotifyRefreshToken();

        assertIsDefined(currentRefreshToken);

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

        await upsertUserSpotifyData({
          tokenData: { accessToken, tokenType, expiresIn, scope, issuedAt },
          refreshToken,
        });
      } catch (_e) {
        //TODO: Refersh token sometimes revoked, needs re-authorization
        store.dispatch(authApi.endpoints.signOut.initiate({}));

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

export { spotifyService };

function isAxiosError(error: unknown): error is AxiosError {
  return error != null && typeof error === 'object' && 'response' in error;
}
