import { trackView } from '@/lib/aptabase/aptabase';
import { sentryInitOptions } from '@/lib/sentry/sentry.init';
import { store } from '@/store/store';
import { init } from '@aptabase/react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, usePathname } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Provider as ReduxProvider } from 'react-redux';
import * as Sentry from 'sentry-expo';

init(process.env.EXPO_PUBLIC_APTABASE_KEY);

Sentry.init(sentryInitOptions());

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
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
  const colorScheme = useColorScheme();

  return (
    <ReduxProvider store={store}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </ThemeProvider>
    </ReduxProvider>
  );
}
