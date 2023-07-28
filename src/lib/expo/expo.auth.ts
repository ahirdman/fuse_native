import * as AuthSession from 'expo-auth-session';

import { catchException } from '../sentry/sentry.exceptions';
import { assertIsDefined } from '../util/assert';
import { generateShortUUID } from '../util';
import { updateUserSpotifyData } from '../supabase/supabase.queries';

import { redirectUri } from './expo.linking';

import { store } from '@/store/store';
import { setToken } from '@/store/user/user.slice';

const CLIENT_ID = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID;

export async function authorizeSpotify(userId: string) {
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

      await persistTokenData({ data: tokenResult, userId });
    } else {
      //TODO: Show user error
    }
  } catch (error) {
    catchException(error);
  }
}

interface PersistTokenDataArgs {
  data: AuthSession.TokenResponse;
  userId: string;
}

async function persistTokenData({ data, userId }: PersistTokenDataArgs) {
  assertIsDefined(data.refreshToken);

  const { accessToken, tokenType, expiresIn, scope, issuedAt } = data;

  await updateUserSpotifyData({
    tokenData: { accessToken, tokenType, expiresIn, scope, issuedAt },
    refreshToken: data.refreshToken,
    id: userId,
  });

  store.dispatch(
    setToken({ accessToken, tokenType, expiresIn, scope, issuedAt }),
  );
}
