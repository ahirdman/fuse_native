import { Native } from 'sentry-expo';

export function catchException(error: unknown) {
  Native.captureException(error);
}
