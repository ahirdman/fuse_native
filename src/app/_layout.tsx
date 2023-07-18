import { useFonts } from 'expo-font';
import { SplashScreen, Stack, usePathname } from 'expo-router';
import * as Sentry from 'sentry-expo';

import { NativeBaseProvider } from 'native-base';
import { useEffect } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { init } from '@aptabase/react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { trackView } from '@/lib/aptabase/aptabase';
import { sentryInitOptions } from '@/lib/sentry/sentry.init';
import { store } from '@/store/store';
import { ApplicationTheme } from '@/style/theme';

init(process.env.EXPO_PUBLIC_APTABASE_KEY);

Sentry.init(sentryInitOptions());

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '/(auth)/auth',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const pathname = usePathname();

  const [fontsLoaded, fontsError] = useFonts({
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (fontsError) {
      Sentry.Native.captureException(fontsError);
    }
  }, [fontsError]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    trackView(pathname);
  }, [pathname]);

  if (!fontsLoaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <ReduxProvider store={store}>
      <NativeBaseProvider theme={ApplicationTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)/auth" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </NativeBaseProvider>
    </ReduxProvider>
  );
}
