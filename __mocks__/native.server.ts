import { setupServer } from 'msw/native';

export function initMocks() {
  const nativeServer = setupServer();
  nativeServer.listen({ onUnhandledRequest: 'bypass' });
  nativeServer.listHandlers();
}
