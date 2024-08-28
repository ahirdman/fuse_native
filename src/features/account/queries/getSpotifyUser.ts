import { useQuery } from '@tanstack/react-query';
import { getSpotifyUser } from 'auth/queries/authorizeSpotify';

export const useGetSpotifyUser = () =>
  useQuery({
    queryKey: ['spotifyUser'],
    queryFn: () => getSpotifyUser(),
  });
