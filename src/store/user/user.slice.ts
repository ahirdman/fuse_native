import { createSlice, isRejectedWithValue } from '@reduxjs/toolkit';

import { refreshSpotifyToken } from '@/lib/expo/expo.auth';
import { assertIsDefined } from '@/lib/util/assert';
import { updateUserSpotifyData } from '@/lib/supabase/supabase.queries';

import type { AppStartListening } from '../listenerMiddleware';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  SpotifyToken,
  Subscription,
  User,
  UserState,
} from './user.interface';

const initialState: UserState = {
  user: null,
  token: null,
  subscription: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<User>) => {
      if (!state.user) {
        state.user = action.payload;
      }
    },
    signOut: (state) => {
      state.user = null;
      state.token = null;
      state.subscription = null;
    },
    setToken: (state, action: PayloadAction<SpotifyToken>) => {
      state.token = action.payload;
    },
    setSubscription: (state, action: PayloadAction<Subscription>) => {
      state.subscription = action.payload;
    },
  },
});

export const { signIn, signOut, setToken, setSubscription } = userSlice.actions;

export default userSlice.reducer;

export const addExpiredSpotifyTokenListener = (
  startListening: AppStartListening,
) => {
  startListening({
    predicate: (action, currentState) => {
      const tokenExpired =
        // @ts-ignore
        isRejectedWithValue(action) && action.payload.status === 401;
      const signedIn = currentState.user.user !== null;

      return signedIn && tokenExpired;
    },
    effect: async (_, listenerApi) => {
      const refreshedTokenData = await refreshSpotifyToken();

      assertIsDefined(refreshedTokenData);

      const {
        accessToken,
        tokenType,
        expiresIn,
        scope,
        issuedAt,
        refreshToken,
      } = refreshedTokenData;

      const uid = listenerApi.getState().user.user!.id;

      await updateUserSpotifyData({
        id: uid,
        tokenData: { accessToken, tokenType, expiresIn, scope, issuedAt },
        refreshToken,
      });

      listenerApi.dispatch(
        setToken({ accessToken, tokenType, expiresIn, scope, issuedAt }),
      );
    },
  });
};
