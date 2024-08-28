import { init } from '@aptabase/react-native';
import { useMMKVDevTools } from '@dev-plugins/react-native-mmkv';
import { useReactQueryDevTools } from '@dev-plugins/react-query';
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
import { QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { Provider as ReduxProvider } from 'react-redux';
import { TamaguiProvider } from 'tamagui';

import { config } from 'config';
import { queryClient } from 'lib/query/init';
import { store } from 'store';
import tamaguiConfig from '../tamagui.config';
import RootNavigationStack from './navigation';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as Sentry from '@sentry/react-native';
import { useAppDataLoader } from 'auth/hooks/useAppDataLoader';

Sentry.init({
  dsn: 'https://c5335b4f59964695b505f94c4e8c312d@o4505549130301440.ingest.us.sentry.io/4505549132922880',
  tracesSampleRate: 1.0,
  _experiments: {
    profilesSampleRate: 1.0,
  },

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // enableSpotlight: __DEV__,
});

init(config.aptabase.apiKey);
void SplashScreen.preventAutoHideAsync();

function App() {
  Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  Purchases.configure({ apiKey: config.revenueCat.apiKey });

  useReactQueryDevTools(queryClient);
  useMMKVDevTools();

  const [appReady] = useAppDataLoader();

  const [fontsLoaded] = useFonts({
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
    if (fontsLoaded && appReady) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, appReady]);

  if (!fontsLoaded || !appReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ReduxProvider store={store}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <TamaguiProvider config={tamaguiConfig}>
            <BottomSheetModalProvider>
              <StatusBar style="light" />
              <RootNavigationStack />
            </BottomSheetModalProvider>
          </TamaguiProvider>
        </GestureHandlerRootView>
      </ReduxProvider>
    </QueryClientProvider>
  );
}

export default Sentry.wrap(App);
