import { skipToken, useQuery } from '@tanstack/react-query';
import { canOpenURL } from 'expo-linking';

async function isSpotifyInstalled(uri: string): Promise<boolean> {
  const isInstalled = await canOpenURL(uri);

  return isInstalled;
}

export const useIsSpotifyInstalled = (uri?: string | undefined) =>
  useQuery({
    queryKey: ['isInstalled'],
    queryFn: uri ? () => isSpotifyInstalled(uri) : skipToken,
  });
