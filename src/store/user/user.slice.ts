import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";
import type {
	AppSubscription,
	SpotifyToken,
	SpotifyUser,
	User,
	UserState,
} from "./user.interface";

const initialState: UserState = {
	user: undefined,
	spotifyToken: undefined,
	appSubscription: undefined,
	spotifyUser: undefined,
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		signIn: (state, action: PayloadAction<User>) => {
			if (!state.user || state.user.id !== action.payload.id) {
				state.user = action.payload;
			}
		},
		updateSpotifyToken: (state, action: PayloadAction<SpotifyToken>) => {
			state.spotifyToken = action.payload;
		},
		updateSubscription: (state, action: PayloadAction<AppSubscription>) => {
			state.appSubscription = action.payload;
		},
		updateSpotifyUserId: (state, action: PayloadAction<SpotifyUser>) => {
			state.spotifyUser = { id: action.payload.id };
		},
		hydrateAuthState: (_, action: PayloadAction<UserState>) => action.payload,
		signOut: () => initialState,
	},
});

export const {
	signIn,
	signOut,
	updateSpotifyToken,
	updateSubscription,
	updateSpotifyUserId,
	hydrateAuthState,
} = userSlice.actions;

export default userSlice.reducer;
