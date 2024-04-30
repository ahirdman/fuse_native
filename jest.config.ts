import type { Config } from 'jest';

const config: Config = {
  rootDir: '.',
  preset: 'jest-expo',
  setupFilesAfterEnv: ['./__test__/setup.ts'],
  moduleNameMapper: {
    'test-utils': '<rootDir>/__test__/test-utils',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|react-native-svg|@legendapp|tamagui|@tamagui/.*|moti|react-native-reanimated|react-redux)',
  ],
};

export default config;
