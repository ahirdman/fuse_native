import { useMutation } from '@tanstack/react-query';
import {
  AuthRequest,
  type AuthRequestConfig,
  Prompt,
  ResponseType,
  type TokenResponse,
  exchangeCodeAsync,
  makeRedirectUri,
} from 'expo-auth-session';

import { config } from 'config';
import { showToast } from 'util/toast';

import { spotifyTokenSchema } from 'auth/auth.interface';
import { getSpotifyUser } from 'user/queries/getSpotifyUser';
import { upsertSpotifyToken } from './upsertSpotifyToken';

async function authorizeSpotify(): Promise<TokenResponse | undefined> {
  const redirectUri = makeRedirectUri({
    scheme: 'fuse',
    path: 'auth',
  });

  const state = generateShortUUID();
  const clientId = config.spotify.clientId;
  const discovery = config.expoAuth.discovery;

  const authRequestOptions: AuthRequestConfig = {
    scopes: config.spotify.authScope,
    responseType: ResponseType.Code,
    prompt: Prompt.Login,
    redirectUri,
    clientId,
    state,
  };

  const authRequest = new AuthRequest(authRequestOptions);
  const authorizeResult = await authRequest.promptAsync(discovery);

  if (authorizeResult.type === 'cancel') {
    return undefined;
  }

  if (authorizeResult.type !== 'success' || !authorizeResult.params.code) {
    throw new Error('Code response was unsuccesfull');
  }

  const tokenResult = await exchangeCodeAsync(
    {
      code: authorizeResult.params.code,
      redirectUri,
      clientId,
      extraParams: authRequest.codeVerifier
        ? { code_verifier: authRequest.codeVerifier }
        : undefined,
    },
    discovery,
  );

  return tokenResult;
}

function generateShortUUID() {
  return Math.random().toString(36).substring(2, 15);
}

export const useAuthorizeSpotify = () =>
  useMutation({
    mutationFn: async () => {
      const token = await authorizeSpotify();

      const parsedToken = spotifyTokenSchema.parse(token);

      const spotifyUser = await getSpotifyUser(parsedToken.accessToken); // TODO: When to get spotofy user id

      await upsertSpotifyToken(parsedToken);

      return {
        ...parsedToken,
        ...spotifyUser,
      };
    },
    onError: () => {
      showToast({
        title: 'Something went wrong',
        preset: 'error',
        message: 'Spotify authorization did not work...',
      });
    },
  });
