import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from 'store';

import type { SpotifyToken, UserState } from 'auth/auth.interface';

const initialState: Partial<UserState> = {
  user: undefined,
  profile: undefined,
  spotifyToken: undefined,
  subscription: undefined,
  spotifyUser: undefined,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn: (_, action: PayloadAction<Required<UserState>>) => action.payload,
    signOut: () => initialState,
    updateSpotifyToken: (state, action: PayloadAction<SpotifyToken>) => {
      state.spotifyToken = action.payload;
    },
    updatePushToken: (state, action: PayloadAction<string>) => {
      if (!state.user) {
        throw new Error('Tried updating push token without active user');
      }

      state.user.pushToken = action.payload;
    },
  },
});

export const { signIn, signOut, updateSpotifyToken, updatePushToken } =
  authSlice.actions;

export default authSlice.reducer;

export const selectSpotifyUserId = (state: RootState) =>
  state.auth.spotifyUser?.id;

export const selectUserId = (state: RootState): string => {
  if (!state.auth.user) {
    throw new Error('User is null');
  }

  return state.auth.user.id;
};
