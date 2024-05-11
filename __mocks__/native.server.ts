import { setupServer } from 'msw/native';
import { handlers } from './runtime.handlers';

export function initMocks() {
  const nativeServer = setupServer(...handlers);

  nativeServer.listen({ onUnhandledRequest: 'bypass' });
  nativeServer.listHandlers();
}
