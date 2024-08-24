import type { ConfigContext, ExpoConfig } from 'expo/config';

// biome-ignore lint/suspicious/noExplicitAny: reason
type ExpoPlugins = (string | [] | [string] | [string, any])[];

function expoPlugins(env: string): ExpoPlugins {
  const common = ['expo-build-properties', 'expo-font'];

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
    infoPlist: {
      LSApplicationQueriesSchemes: ['spotify'],
    },
  },
  experiments: {
    tsconfigPaths: true,
  },
  updates: {
    url: 'https://u.expo.dev/deeb4c71-d291-4e30-b509-43b38582400a',
  },
  platforms: ['ios'],
  runtimeVersion: {
    policy: 'fingerprint',
  },
  extra: {
    eas: {
      projectId: 'deeb4c71-d291-4e30-b509-43b38582400a',
    },
  },
  owner: 'ahirdman',
};

function parseReleaseCandidateVersion(version: string): string {
  const regex = /^(\d+\.\d+\.\d+)(?:-rc\.\d+)?$/;
  const match = version.match(regex);
  return match?.[1] ? match[1] : version;
}

export default ({ config }: ConfigContext): ExpoConfig => {
  const backgroundColor = '#1C1C1C';
  const buildEnv = process.env.EAS_ENV;
  const name = 'Fuse - Playlist Manager';
  const slug = 'fuse';
  const applicationIdentifier = 'com.ahirdman.fuse';
  const icon = './assets/icons/app_icon.png';
  const plugins = expoPlugins(buildEnv as string);
  const version = config.version
    ? parseReleaseCandidateVersion(config.version)
    : config.version;

  const developmentConfig: ExpoConfig = {
    ...common,
    name: `${name} (Dev)`,
    version,
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
        version,
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
        version,
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
