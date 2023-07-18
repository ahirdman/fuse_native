import type { ExpoConfig } from 'expo/config';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/
type ExpoPlugins = (string | [] | [string] | [string, any])[];

function expoPlugins(env: string): ExpoPlugins {
  const common = ['expo-router', 'sentry-expo'];

  switch (env) {
    case 'development':
      return [
        ...common,
        [
          'expo-build-properties',
          {
            ios: {
              flipper: true,
            },
          },
        ],
      ];

    default:
      return common;
  }
}

export default (): ExpoConfig => {
  const plugins = expoPlugins(process.env.EAS_ENV as string);

  return {
    name: 'Fuse',
    slug: 'fuse',
    version: '0.0.1',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'fuse',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#3d3e42',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: false,
      bundleIdentifier: 'com.ahirdman.fuse',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#3d3e42',
      },
    },
    plugins,
    hooks: {
      postPublish: [
        {
          file: 'sentry-expo/upload-sourcemaps',
          config: {
            organization: 'nomad-1l',
            project: 'fuse',
          },
        },
      ],
    },
    experiments: {
      tsconfigPaths: true,
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: 'deeb4c71-d291-4e30-b509-43b38582400a',
      },
    },
    owner: 'ahirdman',
  };
};
