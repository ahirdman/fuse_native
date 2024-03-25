import { useQuery } from '@tanstack/react-query';
import { supabase } from 'lib/supabase/supabase.init';

import { spotifyService } from 'services/spotify.api';
import { SpotifyTrack, SpotifyTrackDto } from 'track/track.interface';
import { tagKeys } from './keys';

interface GetSpotifyTracksRes {
  tracks: SpotifyTrackDto[];
}

async function getSpotifyTracks(
  trackIds: string[],
): Promise<SpotifyTrackDto[]> {
  const result = await spotifyService.get<GetSpotifyTracksRes>(
    `/tracks?ids=${trackIds.join(',')}`,
  );

  return result.data.tracks;
}

async function getTagTracks(id: number) {
  const { data, error } = await supabase
    .from('tags_with_track_ids')
    .select('track_ids')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data.track_ids) {
    return undefined;
  }

  const tracks = await getSpotifyTracks(data.track_ids);

  return tracks;
}

function sanitizeSpotifyTracks(data: SpotifyTrackDto[]): SpotifyTrack[] {
  return data.map((trackDto) => ({
    id: trackDto.id,
    uri: trackDto.uri,
    artist: trackDto.artists[0]?.name,
    albumCovers: trackDto.album.images,
    album: trackDto.album.name,
    name: trackDto.name,
    explicit: trackDto.explicit,
    duration: trackDto.duration_ms,
  }));
}

interface UseGetTagTracksArgs {
  tagId: number;
}

export const useGetTagTracks = ({ tagId }: UseGetTagTracksArgs) =>
  useQuery({
    queryKey: tagKeys.detail(tagId),
    queryFn: () => getTagTracks(tagId),
    select: (data) => {
      return !data ? data : sanitizeSpotifyTracks(data);
    },
  });
