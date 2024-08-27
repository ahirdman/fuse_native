import { useMutation } from '@tanstack/react-query';

import { authorizeSpotify } from 'lib/expo/expo.auth';
import { showToast } from 'util/toast';

import {
  type SpotifyToken,
  type SpotifyUser,
  spotifyTokenSchema,
} from 'auth/auth.interface';
import { spotifyService } from 'services/spotify.api';
import { insertSpotifyCredentials } from './insertSpotifyCredentials';

interface GetSpotifyUserRes {
  id: string;
  product: string;
  uri: string;
  email: string;
  display_name: string;
  country: string;
  followers: {
    total: number;
  };
  images: SpotifyUserImage[];
}

interface SpotifyUserImage {
  url: string;
  height: number | null;
  width: number | null;
}

async function getSpotifyUser(token?: string | undefined) {
  const result = await spotifyService.get<GetSpotifyUserRes>('/me', {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return result.data;
}

export const useAuthorizeSpotify = () =>
  useMutation({
    mutationFn: async (): Promise<{
      spotifyToken: SpotifyToken;
      spotifyUser: SpotifyUser;
    }> => {
      const token = await authorizeSpotify();
      const parsedToken = spotifyTokenSchema.parse(token);
      const spotifyUser = await getSpotifyUser(parsedToken.accessToken);

      await insertSpotifyCredentials({ spotifyUser, tokenData: parsedToken });

      return {
        spotifyToken: parsedToken,
        spotifyUser,
      };
    },
    onError: () => {
      showToast({
        title: 'Something went wrong',
        preset: 'error',
        message: 'Spotify authorization did not work...',
      });
    },
  });
