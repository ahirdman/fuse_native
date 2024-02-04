import '@testing-library/jest-native/extend-expect';
import { server } from '../__mocks__/node.server';

jest.mock('@react-native-async-storage/async-storage', () =>
  /* eslint-disable-next-line @typescript-eslint/no-unsafe-return */
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' });
  server.printHandlers();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
