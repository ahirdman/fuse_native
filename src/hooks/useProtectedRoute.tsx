import { router, useRootNavigationState, useSegments } from 'expo-router';

import { useEffect } from 'react';

import { useAppSelector } from '@/store/hooks';

import type { User } from '@supabase/supabase-js';

function useProtectedRoute(supabaseUser: User | undefined) {
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

export default useProtectedRoute;
