import { createClient } from '@supabase/supabase-js';
import { MMKV } from 'react-native-mmkv'

import { config } from 'config';
import type { Database } from 'lib/supabase/database.interface';

const storage = new MMKV({ id: 'supabase-storage' })

const mmkvStorageConfig = {
  setItem: (key: string, data: string) => storage.set(key, data),
  getItem: (key: string) => storage.getString(key) ?? null,
  removeItem: (key: string) => storage.delete(key),
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
