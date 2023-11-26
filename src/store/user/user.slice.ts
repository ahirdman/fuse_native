import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";
import type {
	SpotifyToken,
	Subscription,
	User,
	UserState,
} from "./user.interface";

const initialState: UserState = {
	user: undefined,
	token: undefined,
	subscription: undefined,
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		signIn: (state, action: PayloadAction<User>) => {
			if (!state.user) {
				state.user = action.payload;
			}
		},
		signOut: () => initialState,
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
