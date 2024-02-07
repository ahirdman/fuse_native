import { init } from '@aptabase/react-native';
import * as SplashScreen from 'expo-splash-screen';
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

import RootNavigationStack from './navigation';

import useAppDataLoader from '@/hooks/useAppDataLoader';
import { store } from '@/store/store';
import { ApplicationTheme, nativeBaseConfig } from '@/style/theme';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { TamaguiProvider } from 'tamagui';
import tamaguiConfig from 'tamagui.config';
import { config } from './config';

init(config.aptabase.apiKey);
void SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function App() {
  Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  Purchases.configure({ apiKey: config.revenueCat.apiKey });

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
        <TamaguiProvider config={tamaguiConfig}>
          <NativeBaseProvider
            theme={ApplicationTheme}
            config={nativeBaseConfig}
          >
            <StatusBar style="light" />
            <RootNavigationStack />
          </NativeBaseProvider>
        </TamaguiProvider>
      </ReduxProvider>
    </QueryClientProvider>
  );
}
