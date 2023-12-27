import { supabase } from "@/lib/supabase/supabase.init";
import { RootState } from "@/store/store";
import { spotifyApi } from "../spotify.api";

interface CreatePlaylistWithTracksRes {
	id: string;
	uri: string;
	snapshot_id: string;
}

interface CreatePlaylistWithTracksArgs {
	name: string;
	description?: string;
	tracks: string[];
	tagId: string;
}

export const playlistApi = spotifyApi.injectEndpoints({
	endpoints: (builder) => ({
		createPlaylistWithTracks: builder.mutation<
			CreatePlaylistWithTracksRes,
			CreatePlaylistWithTracksArgs
		>({
			async queryFn(args, api, _, baseQuery) {
				const userId = (api.getState() as RootState).user.spotifyUser?.id;

				if (!userId) {
					return {
						error: { data: "Spotify User Id was undefined", status: 500 },
					};
				}

				const playlistsResult = await baseQuery({
					url: `/users/${userId}/playlists`,
					method: "POST",
					body: { name: args.name, description: args.description },
				});

				if (playlistsResult.error) {
					return { error: { ...playlistsResult.error } };
				}

				const playlistsResultData =
					playlistsResult.data as CreatePlaylistWithTracksRes;

				const addTracksResult = await baseQuery({
					url: `/playlists/${playlistsResultData.id}/tracks`,
					method: "POST",
					body: { uris: args.tracks },
				});

				if (addTracksResult.error) {
					return { error: { ...addTracksResult.error } };
				}

				const addTracksResultData = addTracksResult.data as {
					snapshot_id: string;
				};

				const { error } = await supabase
					.from("tags")
					.update({
						latest_snapshot_id: addTracksResultData.snapshot_id,
						spotify_playlist_id: playlistsResultData.id,
						spotify_playlist_uri: playlistsResultData.uri,
					})
					.eq("id", args.tagId);

				if (error) {
					return { error: { data: "error updating tag", status: 500 } };
				}

				return {
					data: {
						snapshot_id: addTracksResultData.snapshot_id,
						id: playlistsResultData.id,
						uri: playlistsResultData.uri,
					},
				};
			},
		}),
	}),
	overrideExisting: false,
});

export const { useCreatePlaylistWithTracksMutation } = playlistApi;
