import { createSlice } from '@reduxjs/toolkit';

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
