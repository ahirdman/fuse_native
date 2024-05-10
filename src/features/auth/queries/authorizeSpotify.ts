import { useMutation } from '@tanstack/react-query';

import { authorizeSpotify } from 'lib/expo/expo.auth';
import { showToast } from 'util/toast';

import {
  type SpotifyToken,
  type SpotifyUser,
  spotifyTokenSchema,
} from 'auth/auth.interface';
import { getSpotifyUser } from 'user/queries/getSpotifyUser';
import { insertSpotifyCredentials } from './insertSpotifyCredentials';

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
