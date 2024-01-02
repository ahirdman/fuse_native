import {
	BaseQueryFn,
	FetchArgs,
	FetchBaseQueryError,
	createApi,
	fetchBaseQuery,
} from "@reduxjs/toolkit/dist/query/react";

import { config } from "@/config";
import * as Burnt from "burnt";

import {
	selecteUserSpotifyRefreshToken,
	upsertUserSpotifyData,
} from "@/lib/supabase/supabase.queries";
import { assertIsDefined } from "@/lib/util/assert";
import type { RootState } from "@/store/store";
import { signOut, updateSpotifyToken } from "@/store/user/user.slice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import * as AuthSession from "expo-auth-session";
import { authApi } from "../supabase/auth/auth.endpoints";

export async function refreshSpotifyToken(
	// biome-ignore lint/suspicious/noExplicitAny: reason
	dispatch: ThunkDispatch<any, any, any>,
): Promise<AuthSession.TokenResponse | undefined> {
	try {
		const refreshToken = await selecteUserSpotifyRefreshToken();

		assertIsDefined(refreshToken);

		const request = await AuthSession.refreshAsync(
			{
				clientId: config.spotify.clientId,
				refreshToken,
			},
			config.expoAuth.discovery,
		);

		return request;
	} catch (error) {
		console.error(error);
		//TODO: Refersh token sometimes revoked, needs re-authorization
		dispatch(authApi.endpoints.signOut.initiate());
		Burnt.toast({
			title: "Something went wrong",
			preset: "error",
			message: "Refreshing Spotify token did not work...",
		});
	}
}

const spotifyBaseQuery = fetchBaseQuery({
	baseUrl: config.spotify.baseUrl,
	prepareHeaders: (headers, { getState }) => {
		const token = (getState() as RootState).user.spotifyToken?.accessToken;

		if (token) {
			headers.set("Authorization", `Bearer ${token}`);
		}

		return headers;
	},
});

const baseQueryWithReauth: BaseQueryFn<
	string | FetchArgs,
	unknown,
	FetchBaseQueryError
> = async (args, api, extraOptions) => {
	let result = await spotifyBaseQuery(args, api, extraOptions);

	if (result.error && result.error.status === 401) {
		const refreshResult = await refreshSpotifyToken(api.dispatch);

		if (refreshResult) {
			const {
				refreshToken,
				accessToken,
				tokenType,
				expiresIn,
				scope,
				issuedAt,
			} = refreshResult;

			const userId = (api.getState() as RootState).user.user?.id;

			assertIsDefined(userId);

			api.dispatch(
				updateSpotifyToken({
					accessToken,
					tokenType,
					expiresIn,
					scope,
					issuedAt,
				}),
			);

			await upsertUserSpotifyData({
				tokenData: { accessToken, tokenType, expiresIn, scope, issuedAt },
				refreshToken,
			});

			result = await spotifyBaseQuery(args, api, extraOptions);
		} else {
			api.dispatch(signOut());
		}
	}

	return result;
};

export const spotifyApi = createApi({
	reducerPath: "spotifyApi",
	baseQuery: baseQueryWithReauth,
	keepUnusedDataFor: 600,
	endpoints: () => ({}),
});
