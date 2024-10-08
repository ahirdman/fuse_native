import type { EnvironmentConfig } from '.';

export const applicationConfiguration: EnvironmentConfig = {
  supabase: {
    url: 'http://192.168.0.34:54321',
    anonKey:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
  },
  spotify: {
    clientId: process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID,
    baseUrl: 'https://api.spotify.com/v1',
    authScope: [
      'user-read-email',
      'user-read-private',
      'user-top-read',
      'user-library-read',
      'user-library-modify',
      'playlist-modify-public',
      'playlist-modify-private',
      'playlist-read-private',
      'playlist-read-collaborative',
      'ugc-image-upload',
    ],
  },
  expoAuth: {
    discovery: {
      authorizationEndpoint: 'https://accounts.spotify.com/authorize',
      tokenEndpoint: 'https://accounts.spotify.com/api/token',
    },
  },
};
