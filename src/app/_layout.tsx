import { SplashScreen, Stack, usePathname } from 'expo-router';
import * as Sentry from 'sentry-expo';
import { StatusBar } from 'expo-status-bar';

import {
  Mulish_200ExtraLight,
  Mulish_300Light,
  Mulish_400Regular,
  Mulish_500Medium,
  Mulish_600SemiBold,
  Mulish_700Bold,
  Mulish_800ExtraBold,
  Mulish_900Black,
  useFonts,
} from '@expo-google-fonts/mulish';
import { NativeBaseProvider } from 'native-base';
import { useEffect } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { init } from '@aptabase/react-native';

import { trackView } from '@/lib/aptabase/aptabase';
import { sentryInitOptions } from '@/lib/sentry/sentry.init';
import { store } from '@/store/store';
import { ApplicationTheme } from '@/style/theme';
import AuthProvider from '@/providers/auth.provider';

init(process.env.EXPO_PUBLIC_APTABASE_KEY);
Sentry.init(sentryInitOptions());

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const pathname = usePathname();

  const [fontsLoaded, fontsError] = useFonts({
    Mulish_200ExtraLight,
    Mulish_300Light,
    Mulish_400Regular,
    Mulish_500Medium,
    Mulish_600SemiBold,
    Mulish_700Bold,
    Mulish_800ExtraBold,
    Mulish_900Black,
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
        <AuthProvider>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </AuthProvider>
      </NativeBaseProvider>
    </ReduxProvider>
  );
}
