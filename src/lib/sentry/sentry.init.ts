import * as Network from 'expo-network';
import * as Sentry from 'sentry-expo';
import type { SentryExpoNativeOptions } from 'sentry-expo';

export function sentryInitOptions(): SentryExpoNativeOptions {
  const devServerPort = 8081;
  let devServerIpAddress: string | null = null;

  void Network.getIpAddressAsync().then((ip) => {
    devServerIpAddress = ip;
  });

  return {
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    enableInExpoDevelopment: true,
    debug: true,
    tracesSampleRate: 1,
    enableAppHangTracking: false,
    integrations: [
      new Sentry.Native.ReactNativeTracing({
        shouldCreateSpanForRequest: (url) => {
          return (
            !__DEV__ ||
            !url.startsWith(
              `http://${devServerIpAddress}:${devServerPort}/logs`,
            )
          );
        },
      }),
    ],
  };
}
