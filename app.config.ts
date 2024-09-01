import type { ConfigContext, ExpoConfig } from 'expo/config';

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
    privacyManifests: {
      NSPrivacyCollectedDataTypes: [
        {
          NSPrivacyCollectedDataType: 'NSPrivacyCollectedDataTypeCrashData',
          NSPrivacyCollectedDataTypeLinked: false,
          NSPrivacyCollectedDataTypeTracking: false,
          NSPrivacyCollectedDataTypePurposes: [
            'NSPrivacyCollectedDataTypePurposeAppFunctionality',
          ],
        },
        {
          NSPrivacyCollectedDataType:
            'NSPrivacyCollectedDataTypePerformanceData',
          NSPrivacyCollectedDataTypeLinked: false,
          NSPrivacyCollectedDataTypeTracking: false,
          NSPrivacyCollectedDataTypePurposes: [
            'NSPrivacyCollectedDataTypePurposeAppFunctionality',
          ],
        },
        {
          NSPrivacyCollectedDataType:
            'NSPrivacyCollectedDataTypeOtherDiagnosticData',
          NSPrivacyCollectedDataTypeLinked: false,
          NSPrivacyCollectedDataTypeTracking: false,
          NSPrivacyCollectedDataTypePurposes: [
            'NSPrivacyCollectedDataTypePurposeAppFunctionality',
          ],
        },
      ],
      NSPrivacyAccessedAPITypes: [
        {
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryUserDefaults',
          NSPrivacyAccessedAPITypeReasons: ['CA92.1'],
        },
        {
          NSPrivacyAccessedAPIType:
            'NSPrivacyAccessedAPICategorySystemBootTime',
          NSPrivacyAccessedAPITypeReasons: ['35F9.1'],
        },
        {
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryFileTimestamp',
          NSPrivacyAccessedAPITypeReasons: ['C617.1'],
        },
      ],
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
  plugins: [
    'expo-build-properties',
    'expo-font',
    'expo-localization',
    [
      '@sentry/react-native/expo',
      {
        url: 'https://sentry.io/',
        project: 'fuse',
        organization: 'nomad-1l',
      },
    ],
  ],
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
  const icon = './assets/images/icon.png';
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
      };

    default:
      return developmentConfig;
  }
};
