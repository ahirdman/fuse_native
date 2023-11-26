import { spotifyApi } from "../spotify.api";

import type {
	SpotifyTrack,
	UserSavedTracksDto,
	UserTracksReq,
} from "./tracks.interface";

export const GET_SPOTIFY_TRACKS_QUERY_ID = "getUserSavedTracks";

export const tracksApi = spotifyApi.injectEndpoints({
	endpoints: (builder) => ({
		getUserSavedTracks: builder.query({
			query: ({ limit, offset }: UserTracksReq) =>
				`/me/tracks?offset=${offset}&limit=${limit}`,
			keepUnusedDataFor: 600,
			transformResponse: (response: UserSavedTracksDto): SpotifyTrack[] => {
				return response.items.map((item) => ({
					addedAt: item.added_at,
					id: item.track.id,
					artist: item.track.artists[0]?.name,
					albumCovers: item.track.album.images,
					albumName: item.track.album.name,
					name: item.track.name,
					explicit: item.track.explicit,
					duration: item.track.duration_ms,
				}));
			},
			serializeQueryArgs: () => {
				return GET_SPOTIFY_TRACKS_QUERY_ID;
			},
			merge: (currentCache, newItems): SpotifyTrack[] => {
				return [...currentCache, ...newItems];
			},
			forceRefetch: ({ currentArg, previousArg }) => {
				return currentArg?.offset !== previousArg?.offset;
			},
		}),
	}),
	overrideExisting: false,
});

export const { useGetUserSavedTracksQuery } = tracksApi;
