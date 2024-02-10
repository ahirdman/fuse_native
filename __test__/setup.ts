import { afterAll, afterEach, beforeAll } from 'bun:test';
import { server } from '../__mocks__/node.server';
//import '@testing-library/jest-native/extend-expect';

// mock('@react-native-async-storage/async-storage', () =>
//   require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
// );

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' });
  server.listHandlers();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
