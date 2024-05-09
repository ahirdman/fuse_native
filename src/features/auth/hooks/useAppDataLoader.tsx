import { useEffect, useState } from 'react';

import { supabase } from 'lib/supabase/supabase.init';
import { store } from 'store';

import { userStateSchema } from 'auth/auth.interface';
import { signIn } from 'auth/auth.slice';
import { deleteAuthStorageValue, getAuthStorageValue } from 'auth/auth.storage';

export function useAppDataLoader() {
  const [appReady, setAppReady] = useState(false);

  async function hydrateStoredSession() {
    try {
      const storedSession = await supabase.auth.getSession();

      if (storedSession.data.session) {
        const storedUser = getAuthStorageValue('user');
        const storedProfile = getAuthStorageValue('profile');
        const storedToken = getAuthStorageValue('spotifyToken');
        const storedSpotifyUser = getAuthStorageValue('spotifyUser');
        const storedSubscription = getAuthStorageValue('subscription');

        const storedUserState = userStateSchema.parse({
          user: storedUser,
          profile: storedProfile,
          spotifyToken: storedToken,
          spotifyUser: storedSpotifyUser,
          subscription: storedSubscription,
        });

        store.dispatch(signIn(storedUserState));
      }
    } catch {
      deleteAuthStorageValue('all');
      await supabase.auth.signOut();

    } finally {
      setAppReady(true);
    }
  }

  useEffect(() => {
    hydrateStoredSession();
  }, [hydrateStoredSession]);

  return [appReady] as const;
}
