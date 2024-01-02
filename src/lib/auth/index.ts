import { SpotifyToken, UserState } from "@/store/user/user.interface";
import { hydrateAuthState, signIn } from "@/store/user/user.slice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { Session } from "@supabase/supabase-js";
import { selectUserData } from "../supabase/supabase.queries";
import { isBoolean } from "../util/assert";

export async function handleAuthStateSignIn(
	session: Session | null,
	// biome-ignore lint/suspicious/noExplicitAny: reason
	dispatch: ThunkDispatch<any, any, any>,
) {
	if (!session?.user) return;

	const dbUserData = await selectUserData();

	if (!dbUserData) {
		dispatch(signIn({ id: session.user.id }));
		return;
	}

	const userState: UserState = { user: { id: session.user.id } };
	const parsedSpotifyToken = SpotifyToken.safeParse(
		dbUserData.spotify_token_data,
	);

	if (parsedSpotifyToken.success) {
		userState.spotifyToken = parsedSpotifyToken.data;
	}

	if (dbUserData.spotify_user_id) {
		userState.spotifyUser = { id: dbUserData.spotify_user_id };
	}

	if (isBoolean(dbUserData.is_subscribed)) {
		userState.appSubscription = { subscribed: dbUserData.is_subscribed };
	}

	dispatch(hydrateAuthState(userState));
}
