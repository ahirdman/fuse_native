import { useQuery } from '@tanstack/react-query';
import { fuseKeys } from 'fuse/queries/keys';
import { supabase } from 'lib/supabase/supabase.init';

import { tagKeys } from 'tag/queries/keys';
import {
  getSpotifyTracks,
  sanitizeSpotifyTracks,
} from 'track/queries/getTrack';
import type { SpotifyTrackDto } from 'track/track.interface';

async function getTagTracks(ids: number[]): Promise<SpotifyTrackDto[]> {
  const trackIdSets = await Promise.all(
    ids.map(async (id) => {
      const { data, error } = await supabase
        .from('trackTags')
        .select('track_id')
        .eq('tag_id', id); // NOTE: Could maybe create q single query to check all ids at the same time

      if (error) {
        throw new Error(error.message);
      }

      return data.map((result) => result.track_id);
    }),
  );

  const trackIds = Array.from(new Set(trackIdSets.flat()));
  const tracks = await getSpotifyTracks(trackIds);

  return tracks;
}

interface UseGetTagTracksArgs {
  tagIds: number[];
}

export const useGetTagTracks = ({ tagIds }: UseGetTagTracksArgs) =>
  useQuery({
    queryKey:
      tagIds.length > 1 ? fuseKeys.tracks(tagIds) : tagKeys.tracks(tagIds[0]!), //TODO: FIX
    queryFn: () => getTagTracks(tagIds),
    select: (data) => {
      return sanitizeSpotifyTracks(data);
    },
  });
