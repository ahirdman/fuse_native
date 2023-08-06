import * as AuthSession from 'expo-auth-session';

import { catchException } from '../sentry/sentry.exceptions';
import { assertIsDefined } from '../util/assert';
import { generateShortUUID } from '../util';
import { selecteUserSpotifyRefreshToken } from '../supabase/supabase.queries';

import { redirectUri } from './expo.linking';

import { config } from '@/config';

const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

export async function authorizeSpotify(): Promise<
  AuthSession.TokenResponse | undefined
> {
  try {
    const state = generateShortUUID();

    const authRequestOptions: AuthSession.AuthRequestConfig = {
      responseType: AuthSession.ResponseType.Code,
      clientId: config.spotify.clientId,
      redirectUri,
      prompt: AuthSession.Prompt.Login,
      scopes: config.spotify.authScope,
      state: state,
    };

    const authRequest = new AuthSession.AuthRequest(authRequestOptions);

    const authorizeResult = await authRequest.promptAsync(discovery);

    if (authorizeResult.type === 'success') {
      const tokenResult = await AuthSession.exchangeCodeAsync(
        {
          code: authorizeResult.params.code ?? '', //TODO Fix
          clientId: config.spotify.clientId,
          redirectUri,
          extraParams: {
            code_verifier: authRequest.codeVerifier || '',
          },
        },
        discovery,
      );

      return tokenResult;
    } else {
      return undefined;
      //TODO: Show user error
    }
  } catch (error) {
    catchException(error);
    return undefined;
  }
}

export async function refreshSpotifyToken(): Promise<
  AuthSession.TokenResponse | undefined
> {
  try {
    const refreshToken = await selecteUserSpotifyRefreshToken();

    assertIsDefined(refreshToken);

    const request = await AuthSession.refreshAsync(
      {
        clientId: config.spotify.clientId,
        refreshToken,
      },
      discovery,
    );

    return request;
  } catch (error) {
    catchException(error);
    return undefined;
  }
}
