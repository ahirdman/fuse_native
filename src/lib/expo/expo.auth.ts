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

export async function authorizeSpotify(): Promise<TokenResponse | undefined> {
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
