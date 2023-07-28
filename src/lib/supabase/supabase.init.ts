import * as SecureStore from 'expo-secure-store';

import { setupURLPolyfill } from 'react-native-url-polyfill';
import { createClient } from '@supabase/supabase-js';

import { config } from '@/config';

import type { Database } from './database.interface';

setupURLPolyfill();

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    void SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    void SecureStore.deleteItemAsync(key);
  },
};

export const supabase = createClient<Database>(
  config.supabase.url,
  config.supabase.anonKey,
  {
    auth: {
      storage: ExpoSecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);
