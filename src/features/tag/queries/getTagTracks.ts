import { useQuery } from '@tanstack/react-query';
import { Tables } from 'lib/supabase/database.interface';
import { supabase } from 'lib/supabase/supabase.init';

import { SpotifyTrack } from 'track/tracks.interface';
import { tagKeys } from './keys';

async function getTagTracks(id: number): Promise<QueryReturnType[]> {
  const { data, error } = await supabase
    .from('trackTags')
    .select('tracks(*)')
    .eq('tag_id', id);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

type QueryReturnType = {
  tracks: Tables<'tracks'> | null;
};

function sanitizeSpotifyTracks(data: QueryReturnType[]): SpotifyTrack[] {
  const transformedData = data
    .map((item) => item.tracks)
    .filter((item): item is NonNullable<Tables<'tracks'>> => item !== null)
    .map((track) => {
      const spotifyTrack: SpotifyTrack = {
        albumCovers: track.album_covers
          ? track.album_covers.map((url) => ({
              url,
              height: null,
              width: null,
            }))
          : [{ url: 'NA', width: null, height: null }],
        album: track.album ?? 'NA',
        artist: track.artist ?? 'NA',
        id: track.id,
        uri: track.uri ?? 'NA',
        explicit: track.explicit,
        name: track.name ?? 'NA',
        duration: track.duration,
      };

      return spotifyTrack;
    });

  return transformedData;
}

interface UseGetTagTracksArgs {
  tagId: number;
}

export const useGetTagTracks = ({ tagId }: UseGetTagTracksArgs) =>
  useQuery({
    queryKey: tagKeys.detail(tagId),
    queryFn: () => getTagTracks(tagId),
    select: (data) => sanitizeSpotifyTracks(data),
  });
