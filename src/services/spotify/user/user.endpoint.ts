import { spotifyApi } from "../spotify.api";
import { GetSpotifyUserProfileRes } from "./user.interface";

export const spotifyUserApi = spotifyApi.injectEndpoints({
	endpoints: (builder) => ({
		getUserProfile: builder.query<GetSpotifyUserProfileRes, string | undefined>(
			{
				query: (token) => ({
					url: "/me",
					headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				}),
			},
		),
	}),
});

export const { useGetUserProfileQuery, useLazyGetUserProfileQuery } =
	spotifyUserApi;
