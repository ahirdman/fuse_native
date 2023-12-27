import { Tables } from "@/lib/supabase/database.interface";
import { supabaseApi } from "../supabase.api";
import { supabase } from "@/lib/supabase/supabase.init";
import { SpotifyTrack } from "@/services/spotify/tracks/tracks.interface";

interface GetTracksForTagArgs {
  tagId: number;
}

export const tracksApi = supabaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTracksForTag: builder.query<SpotifyTrack[], GetTracksForTagArgs>({
      async queryFn({ tagId }) {
        const { data, error } = await supabase
          .from("trackTags")
          .select("tracks(*)")
          .eq("tag_id", tagId);

        if (error) {
          return { error };
        }

        const transformedData = data
          .map((item) => item.tracks)
          .filter(
            (item): item is NonNullable<Tables<"tracks">> => item !== null,
          )
          .map((track) => {
            const spotifyTrack: SpotifyTrack = {
              albumCovers: track.album_covers
                ? track.album_covers.map((url) => ({
                  url,
                  height: null,
                  width: null,
                }))
                : [{ url: "NA", width: null, height: null }],
              album: track.album ?? "NA",
              artist: track.artist ?? "NA",
              id: track.id,
              uri: track.uri ?? "NA",
              explicit: track.explicit,
              name: track.name ?? "NA",
              duration: track.duration,
            };

            return spotifyTrack;
          });

        return {
          data: [...transformedData],
        };
      },
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: "Track" as const, id })),
            "Track",
          ]
          : ["Track"],
    }),
  }),
});

export const { useGetTracksForTagQuery } = tracksApi;
