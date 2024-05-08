import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from 'store';

import type { AppSubscription } from 'subscription/subscription.interface';
import type { SpotifyToken, UserState } from './auth.interface';

const initialState: Partial<UserState> = {
  user: undefined,
  spotifyToken: undefined,
  subscription: undefined,
  spotifyUser: undefined,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn: (_, action: PayloadAction<Required<UserState>>) => {
      return action.payload;
    },
    updateSpotifyToken: (state, action: PayloadAction<SpotifyToken>) => {
      state.spotifyToken = action.payload;
    },
    updateSubscription: (state, action: PayloadAction<AppSubscription>) => {
      state.subscription = action.payload;
    },
    signOut: () => initialState,
  },
});

export const { signIn, signOut, updateSpotifyToken, updateSubscription } =
  authSlice.actions;

export default authSlice.reducer;

export const selectSpotifyUserId = (state: RootState) =>
  state.auth.spotifyUser?.id;
