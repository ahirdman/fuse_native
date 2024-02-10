import { init } from '@aptabase/react-native';
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
import { NativeBaseProvider } from 'native-base';
import { useEffect } from 'react';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { Provider as ReduxProvider } from 'react-redux';
import { TamaguiProvider } from 'tamagui';

import { config } from 'config';
import { queryClient } from 'lib/query/init';
import { store } from 'store';
import { ApplicationTheme, nativeBaseConfig } from 'style/theme';
import useAppDataLoader from 'user/useAppDataLoader';
import tamaguiConfig from '../tamagui.config';
import RootNavigationStack from './navigation';

init(config.aptabase.apiKey);
void SplashScreen.preventAutoHideAsync();

export default function App() {
  Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  Purchases.configure({ apiKey: config.revenueCat.apiKey });
  useReactQueryDevTools(queryClient);

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
