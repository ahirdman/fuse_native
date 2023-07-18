import '@testing-library/jest-native/extend-expect';

jest.mock('expo-router', () => {
  return {
    useRouter: () => ({
      push: jest.fn(),
    }),
  };
});

jest.mock('@react-native-async-storage/async-storage', () =>
  /* eslint-disable-next-line @typescript-eslint/no-unsafe-return */
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

beforeAll(() => {});

afterEach(() => {});

afterAll(() => {});
