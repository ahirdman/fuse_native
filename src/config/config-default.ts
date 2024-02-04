import type { EnvironmentConfig } from '.';

export const applicationConfiguration: EnvironmentConfig = {
  supabase: {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL,
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_KEY,
  },
  spotify: {
    clientId: process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID,
    baseUrl: 'https://api.spotify.com/v1',
    authScope: [
      'user-read-email',
      'user-read-private',
      'user-library-read',
      'playlist-modify-public',
      'playlist-modify-private',
    ],
  },
  expoAuth: {
    discovery: {
      authorizationEndpoint: 'https://accounts.spotify.com/authorize',
      tokenEndpoint: 'https://accounts.spotify.com/api/token',
    },
  },
};
