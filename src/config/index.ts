import * as Constants from 'expo-constants';
import { channel } from 'expo-updates';
import { applicationConfiguration as defaultConfig } from './config-default';
import { applicationConfiguration as testConfig } from './config-test';

export interface EnvironmentConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  spotify: {
    clientId: string;
    baseUrl: string;
    authScope: string[];
  };
  expoAuth: {
    discovery: {
      authorizationEndpoint: string;
      tokenEndpoint: string;
    };
  };
}

export interface CommonConfig {
  revenueCat: {
    apiKey: string;
  };
  eas: {
    channel: string;
  };
  meta: {
    appVersion: string;
  };
}

const commonConfig: CommonConfig = {
  revenueCat: {
    apiKey: process.env.EXPO_PUBLIC_REVENUE_CAT_KEY,
  },
  eas: {
    channel: typeof channel === 'string' ? channel : 'NA',
  },
  meta: {
    appVersion: Constants.default.expoConfig?.version ?? 'NA',
  },
};

const envConfig = channel === 'production' ? defaultConfig : testConfig;

export const config = {
  ...commonConfig,
  ...envConfig,
};
