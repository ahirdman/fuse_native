import { useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase/supabase.init';
import { selectUserData } from '@/lib/supabase/supabase.queries';
import { store } from '@/store/store';
import { setSubscription, setToken, signIn } from '@/store/user/user.slice';
import { isBoolean } from '@/lib/util/assert';

import type { SpotifyToken } from '@/store/user/user.interface';

function useAppDataLoader() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    void supabase.auth
      .getSession()
      .then(async (fetchedSession) => {
        if (fetchedSession.data.session) {
          const userData = await selectUserData();

          if (userData && isBoolean(userData.is_subscribed)) {
            store.dispatch(
              setSubscription({ subscribed: userData.is_subscribed }),
            );
          }

          if (userData?.spotify_token_data) {
            const data = userData.spotify_token_data as SpotifyToken;
            store.dispatch(setToken({ ...data }));
          }

          store.dispatch(signIn({ id: fetchedSession.data.session.user.id }));
        }
      })
      .finally(() => setAppReady(true));
  }, []);

  return [appReady] as const;
}

export default useAppDataLoader;
