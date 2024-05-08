import { useEffect, useState } from 'react';

import { supabase } from 'lib/supabase/supabase.init';

export function useAppDataLoader() {
  const [appReady, setAppReady] = useState(false);

  // TODO: Hydrate state from local storage
  // - If a session is stored on local storage, so should all other neccessary user data
  // - Only when signing out and then in - should a fetch to db be done

  useEffect(() => {
    void supabase.auth
      .getSession()
      .then(async (fetchedSession) => {
        if (fetchedSession.data.session) {
          console.log('Get data from local storage');
        }
      })
      .finally(() => setAppReady(true));
  }, []);

  return [appReady] as const;
}
