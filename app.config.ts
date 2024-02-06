import type { ExpoConfig } from 'expo/config';

// biome-ignore lint/suspicious/noExplicitAny: reason
type ExpoPlugins = (string | [] | [string] | [string, any])[];

function expoPlugins(env: string): ExpoPlugins {
  const common = ['expo-build-properties', 'expo-font', 'expo-secure-store'];

  switch (env) {
    default:
      return common;
  }
}

const common: Partial<ExpoConfig> = {
  slug: 'fuse',
  orientation: 'portrait',
  scheme: 'fuse',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: false,
    config: {
      usesNonExemptEncryption: false,
    },
  },
  experiments: {
    tsconfigPaths: true,
  },
  updates: {
    url: 'https://u.expo.dev/deeb4c71-d291-4e30-b509-43b38582400a',
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  extra: {
    eas: {
      projectId: 'deeb4c71-d291-4e30-b509-43b38582400a',
    },
  },
  owner: 'ahirdman',
};

export default (): ExpoConfig => {
  const backgroundColor = '#1C1C1C';
  const buildEnv = process.env.EAS_ENV;
  const name = 'Fuse - Playlist Manager';
  const slug = 'fuse';
  const applicationIdentifier = 'com.ahirdman.fuse';
  const icon = './assets/icons/app_icon.png';

  const plugins = expoPlugins(buildEnv as string);

  const developmentConfig: ExpoConfig = {
    ...common,
    name: `${name} (Dev)`,
    slug,
    icon,
    splash: {
      ...common.splash,
      backgroundColor,
    },
    ios: {
      ...common.ios,
      bundleIdentifier: applicationIdentifier,
    },
    plugins,
  };

  switch (buildEnv) {
    case 'development':
      return developmentConfig;

    case 'test':
      return {
        ...common,
        name: `${name} (Test)`,
        slug,
        icon,
        splash: {
          ...common.splash,
          backgroundColor,
        },
        ios: {
          ...common.ios,
          bundleIdentifier: applicationIdentifier,
        },
        plugins,
      };

    case 'production':
      return {
        ...common,
        name,
        slug,
        icon,
        splash: {
          ...common.splash,
          backgroundColor,
        },
        ios: {
          ...common.ios,
          bundleIdentifier: applicationIdentifier,
        },
        plugins,
      };

    default:
      return developmentConfig;
  }
};
