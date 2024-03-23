import { useEffect, useState } from 'react';

import { supabase } from 'lib/supabase/supabase.init';
import { store } from 'store';

import { handleAuthStateSignIn } from 'user/queries/signIn';

export function useAppDataLoader() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    void supabase.auth
      .getSession()
      .then(async (fetchedSession) => {
        if (fetchedSession.data.session) {
          await handleAuthStateSignIn(
            fetchedSession.data.session,
            store.dispatch,
          );
        }
      })
      .finally(() => setAppReady(true));
  }, []);

  return [appReady] as const;
}
