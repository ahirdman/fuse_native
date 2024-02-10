import * as AuthSession from 'expo-auth-session';

import { config } from 'config';
import { redirectUri } from 'lib/expo/expo.linking';
import { showToast } from 'util/toast';

function generateShortUUID() {
  return Math.random().toString(36).substring(2, 15);
}

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

    const authorizeResult = await authRequest.promptAsync(
      config.expoAuth.discovery,
    );

    if (authorizeResult.type !== 'success') {
      throw new Error('oh no');
    }

    const tokenResult = await AuthSession.exchangeCodeAsync(
      {
        code: authorizeResult.params.code ?? '', //TODO Fix
        clientId: config.spotify.clientId,
        redirectUri,
        extraParams: {
          code_verifier: authRequest.codeVerifier || '',
        },
      },
      config.expoAuth.discovery,
    );

    return tokenResult;
  } catch (_error) {
    showToast({
      title: 'Something went wrong',
      preset: 'error',
      message: 'Spotify authorization did not work...',
    });
  }
}
