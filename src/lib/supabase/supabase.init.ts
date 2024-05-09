import { createClient } from '@supabase/supabase-js';
import { MMKV } from 'react-native-mmkv'

import { config } from 'config';
import type { Database } from 'lib/supabase/database.interface';

export const authSessionStorage = new MMKV({ id: 'supabase-storage' })

const mmkvStorageConfig = {
  setItem: (key: string, data: string) => authSessionStorage.set(key, data),
  getItem: (key: string) => authSessionStorage.getString(key) ?? null,
  removeItem: (key: string) => authSessionStorage.delete(key),
}

export const supabase = createClient<Database>(
  config.supabase.url,
  config.supabase.anonKey,
  {
    auth: {
      storage: mmkvStorageConfig,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);
