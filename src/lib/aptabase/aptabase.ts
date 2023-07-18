import { trackEvent } from '@aptabase/react-native';

export function formatPath(pathname: string) {
  if (pathname === '/') {
    return 'Home';
  }

  return pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(2);
}

export function trackView(pathname: string) {
  const event = pathname.length ? formatPath(pathname) : 'App Started';

  trackEvent(event);
}
