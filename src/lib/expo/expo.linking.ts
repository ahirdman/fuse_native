import { makeRedirectUri } from 'expo-auth-session';

export const redirectUri = makeRedirectUri({
  scheme: 'fuse',
  path: 'auth',
});
