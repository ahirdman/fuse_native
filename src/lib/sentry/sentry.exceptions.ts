import * as Sentry from 'sentry-expo';

export function catchException(error: unknown) {
  Sentry.Native.captureException(error);
}
