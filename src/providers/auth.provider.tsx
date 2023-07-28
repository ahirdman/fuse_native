import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { supabase } from '@/lib/supabase/supabase.init';
import useProtectedRoute from '@/hooks/useProtectedRoute';
import { useAppDispatch } from '@/store/hooks';
import { setSubscription, setToken, signIn } from '@/store/user/user.slice';
import { selectUserData } from '@/lib/supabase/supabase.queries';
import { isBoolean } from '@/lib/util/assert';

import type { SpotifyToken } from '@/store/user/user.interface';
import type { ReactNode } from 'react';
import type { AuthSession } from '@supabase/supabase-js';

interface AuthState {
  session: AuthSession | null | undefined;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function useAuth() {
  return useContext(AuthContext);
}

interface IAuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: IAuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null | undefined>(
    undefined,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_, newSession) => {
        setSession(newSession);

        const userData = await selectUserData();

        if (userData && isBoolean(userData.is_subscribed)) {
          dispatch(setSubscription({ subscribed: userData.is_subscribed }));
        }

        if (userData?.spotify_token_data) {
          const data = userData.spotify_token_data as SpotifyToken;
          dispatch(setToken({ ...data }));
        }

        if (newSession?.user.id) {
          dispatch(signIn({ id: newSession.user.id }));
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [dispatch]);

  const value = useMemo(() => ({ session }), [session]);

  useProtectedRoute();

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
