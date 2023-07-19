import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { SpotifyToken, User, UserState } from './user.interface';

const initialState: UserState = {
  user: null,
  token: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    signOut: (state) => {
      state.user = null;
    },
    setToken: (state, action: PayloadAction<SpotifyToken>) => {
      state.token = action.payload;
    },
  },
});

export const { signIn, signOut, setToken } = userSlice.actions;

export default userSlice.reducer;
