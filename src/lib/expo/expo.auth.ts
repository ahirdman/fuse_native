import * as AuthSession from 'expo-auth-session';

import { catchException } from '../sentry/sentry.exceptions';
import { assertIsDefined } from '../util/assert';
import { generateShortUUID } from '../util';

import { setSecureItem } from './expo.secure';
import { redirectUri } from './expo.linking';

import { store } from '@/store/store';
import { setToken } from '@/store/user/user.slice';

const CLIENT_ID = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID;

export async function authorizeSpotify() {
  try {
    const state = generateShortUUID();

    const discovery = {
      authorizationEndpoint: 'https://accounts.spotify.com/authorize',
      tokenEndpoint: 'https://accounts.spotify.com/api/token',
    };

    const authRequestOptions: AuthSession.AuthRequestConfig = {
      responseType: AuthSession.ResponseType.Code,
      clientId: CLIENT_ID,
      redirectUri,
      prompt: AuthSession.Prompt.Login,
      scopes: ['user-read-email', 'playlist-modify-public'],
      state: state,
    };

    const authRequest = new AuthSession.AuthRequest(authRequestOptions);

    const authorizeResult = await authRequest.promptAsync(discovery);

    if (authorizeResult.type === 'success') {
      const tokenResult = await AuthSession.exchangeCodeAsync(
        {
          code: authorizeResult.params.code,
          clientId: CLIENT_ID,
          redirectUri,
          extraParams: {
            code_verifier: authRequest.codeVerifier || '',
          },
        },
        discovery,
      );

      persistTokenData(tokenResult);
    } else {
      //TODO: Show user error
    }
  } catch (error) {
    catchException(error);
  }
}

function persistTokenData(data: AuthSession.TokenResponse) {
  assertIsDefined(data.refreshToken);
  void setSecureItem({
    key: 'SPOTIFY_REFRESH_TOKEN',
    value: data.refreshToken,
  });

  const { accessToken, tokenType, expiresIn, scope, idToken, issuedAt } = data;

  store.dispatch(
    setToken({ accessToken, tokenType, expiresIn, scope, idToken, issuedAt }),
  );
}
