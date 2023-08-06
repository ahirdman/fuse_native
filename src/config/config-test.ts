import type { ApplicationConfiguration } from '.';

export const applicationConfiguration: ApplicationConfiguration = {
  supabase: {
    url: 'http://id.supabase.co',
    anonKey: 'id',
  },
  spotify: {
    clientId: '',
    baseUrl: '',
    authScope: [
      'user-read-email',
      'playlist-modify-public',
      'user-library-read',
    ],
  },
};
