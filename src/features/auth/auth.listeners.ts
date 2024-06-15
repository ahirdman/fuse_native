import Purchases from 'react-native-purchases';

import { queryClient } from 'lib/query/init';
import { supabase } from 'lib/supabase/supabase.init';
import { stringSchema } from 'schema';
import type { AppStartListening } from 'store/middleware';

import {
  deleteAuthStorageValue,
  setAuthStorageValue,
} from 'auth//auth.storage';
import {
  updatePushToken as updatePushTokenState,
  updateSpotifyToken as updateSpotifyTokenState,
} from 'auth/auth.slice';
import { signIn, signOut } from 'auth/auth.slice';
import { updatePushToken } from 'auth/queries/updatePushToken';
import { updateSpotifyToken } from 'auth/queries/updateSpotifyToken';
import { userSchema } from './auth.interface';

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
        await supabase.auth.signOut();
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

export const addPushTokenUpdateListener = (
  startListening: AppStartListening,
) => {
  startListening({
    actionCreator: updatePushTokenState,
    effect: async (action, listenerApi) => {
      try {
        const user = userSchema.parse(listenerApi.getState().auth.user);

        await updatePushToken({ pushToken: action.payload, userId: user.id });

        setAuthStorageValue('user', { ...user, pushToken: action.payload });
      } catch (error) {
        console.error(error);
      }
    },
  });
};
