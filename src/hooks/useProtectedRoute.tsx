import { router, useRootNavigationState, useSegments } from 'expo-router';

import { useEffect } from 'react';

import { useAppSelector } from '@/store/hooks';

function useProtectedRoute() {
  const segments = useSegments();
  const rootNavState = useRootNavigationState();
  const { token, subscription, user } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!rootNavState.key) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/sign-in');
    }

    if (user && inAuthGroup && token && subscription) {
      router.replace('/(tabs)');
    }
  }, [user, segments, token, subscription, rootNavState.key]);
}

export default useProtectedRoute;
