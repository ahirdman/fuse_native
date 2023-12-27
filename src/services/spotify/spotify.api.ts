import {
	BaseQueryFn,
	FetchArgs,
	FetchBaseQueryError,
	createApi,
	fetchBaseQuery,
} from "@reduxjs/toolkit/dist/query/react";

import { config } from "@/config";

import { refreshSpotifyToken } from "@/lib/expo/expo.auth";
import { upsertUserSpotifyData } from "@/lib/supabase/supabase.queries";
import { assertIsDefined } from "@/lib/util/assert";
import type { RootState } from "@/store/store";
import { setToken, signOut } from "@/store/user/user.slice";

const spotifyBaseQuery = fetchBaseQuery({
	baseUrl: config.spotify.baseUrl,
	prepareHeaders: (headers, { getState }) => {
		const token = (getState() as RootState).user.token?.accessToken;

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
		const refreshResult = await refreshSpotifyToken();

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
				setToken({ accessToken, tokenType, expiresIn, scope, issuedAt }),
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
