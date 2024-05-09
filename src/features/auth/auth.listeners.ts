import { updateSpotifyToken as updateSpotifyTokenState } from 'auth/auth.slice';
import { queryClient } from 'lib/query/init';
import { supabase } from 'lib/supabase/supabase.init';
import Purchases from 'react-native-purchases';
import { stringSchema } from 'schema';
import type { AppStartListening } from 'store/middleware';
import { signIn, signOut } from './auth.slice';
import { deleteAuthStorageValue, setAuthStorageValue } from './auth.storage';
import { updateSpotifyToken } from './queries/updateSpotifyToken';

export const addSignOutDispatchListener = (
  startListening: AppStartListening,
) => {
  startListening({
    actionCreator: signOut,
    effect: async () => {
      try {
        deleteAuthStorageValue('all');
        queryClient.clear();

        await Purchases.logOut(); // NOTE: Figure out how to handle authentication with revenue cat

        const { error } = await supabase.auth.signOut();

        if (error) {
          throw new Error(error.message);
        }
      } catch (error) {
        console.error(error);
      }
    },
  });
};

export const addSignInDispatchListener = (
  startListening: AppStartListening,
) => {
  startListening({
    actionCreator: signIn,
    effect: async (action) => {
      const { user, profile, spotifyUser, spotifyToken, subscription } =
        action.payload;

      setAuthStorageValue('user', user);
      setAuthStorageValue('profile', profile);
      setAuthStorageValue('spotifyUser', spotifyUser);
      setAuthStorageValue('spotifyToken', spotifyToken);
      setAuthStorageValue('subscription', subscription);

      await Purchases.logIn(user.id); // NOTE: Figure out how to handle authentication with revenue cat
    },
  });
};

export const addSpotifyTokenUpdateListener = (
  startListening: AppStartListening,
) => {
  startListening({
    actionCreator: updateSpotifyTokenState,
    effect: async (action, listenerApi) => {
      try {
        const userId = stringSchema.parse(listenerApi.getState().auth.user?.id);

        await updateSpotifyToken({ tokenData: action.payload, userId });

        setAuthStorageValue('spotifyToken', action.payload);
      } catch (error) {
        console.error(error);
      }
    },
  });
};
