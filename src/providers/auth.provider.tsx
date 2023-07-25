import { router, useSegments, useRootNavigationState } from 'expo-router';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { supabase } from '@/lib/supabase/supabase.init';
import { useAppSelector } from '@/store/hooks';

import type { AuthSession, User } from '@supabase/supabase-js';
import type { ReactNode } from 'react';

interface AuthState {
  session: AuthSession | null | undefined;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function useAuth() {
  return useContext(AuthContext);
}

function useAuthRoute(supabaseUser: User | undefined) {
  const segments = useSegments();
  const rootNavState = useRootNavigationState();
  const { token, subscription } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!rootNavState.key) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!supabaseUser && !inAuthGroup) {
      router.replace('/(auth)/sign-in');
    }

    if (supabaseUser && inAuthGroup && token && subscription) {
      router.replace('/(tabs)');
    }
  }, [supabaseUser, segments, token, subscription, rootNavState.key]);
}

interface IAuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: IAuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null | undefined>(
    undefined,
  );

  useEffect(() => {
    void supabase.auth.getSession().then((fetchedSession) => {
      if (fetchedSession.data.session) {
        setSession(fetchedSession.data.session);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(() => ({ session }), [session]);

  useAuthRoute(session?.user);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
