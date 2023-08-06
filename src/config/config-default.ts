import type { ApplicationConfiguration } from '.';

export const applicationConfiguration: ApplicationConfiguration = {
  supabase: {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL,
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_KEY,
  },
  spotify: {
    clientId: process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID,
    baseUrl: 'https://api.spotify.com/v1',
    authScope: [
      'user-read-email',
      'playlist-modify-public',
      'user-library-read',
    ],
  },
};
