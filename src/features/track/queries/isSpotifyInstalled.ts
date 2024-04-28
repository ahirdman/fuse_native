import { useQuery } from '@tanstack/react-query';
import { canOpenURL } from 'expo-linking';

async function isSpotifyInstalled(uri: string): Promise<boolean> {
  const isInstalled = await canOpenURL(uri);

  return isInstalled;
}

export const useIsSpotifyInstalled = (uri?: string) =>
  useQuery({
    queryKey: ['isInstalled'],
    enabled: !!uri,
    queryFn: uri ? () => isSpotifyInstalled(uri) : undefined,
  });
