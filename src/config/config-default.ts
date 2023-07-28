import type { ApplicationConfiguration } from '.';

export const applicationConfiguration: ApplicationConfiguration = {
  supabase: {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL,
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_KEY,
  },
};
