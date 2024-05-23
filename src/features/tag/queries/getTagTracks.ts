import { useQuery } from '@tanstack/react-query';
import { supabase } from 'lib/supabase/supabase.init';

import { tagKeys } from 'tag/queries/keys';
import {
  getSpotifyTracks,
  sanitizeSpotifyTracks,
} from 'track/queries/getTrack';
import type { SpotifyTrackDto } from 'track/track.interface';

async function getTagTracks(id: number): Promise<SpotifyTrackDto[]> {
  const { data, error } = await supabase
    .from('tags_with_track_ids')
    .select('track_ids')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data.track_ids) {
    return [];
  }

  const tracks = await getSpotifyTracks(data.track_ids);

  return tracks;
}

interface UseGetTagTracksArgs {
  tagId: number;
}

export const useGetTagTracks = ({ tagId }: UseGetTagTracksArgs) =>
  useQuery({
    queryKey: tagKeys.tracks(tagId),
    queryFn: () => getTagTracks(tagId),
    select: (data) => {
      return sanitizeSpotifyTracks(data);
    },
  });
