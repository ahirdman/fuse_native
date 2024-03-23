import { useQuery } from '@tanstack/react-query';

import { spotifyService } from 'services/spotify.api';

import { trackKeys } from 'track/queries/keys';
import type { SpotifyTrack, SpotifyTrackDto } from 'track/track.interface';

async function getTrack(id: string) {
  const result = await spotifyService.get<SpotifyTrackDto>(`/tracks/${id}`);

  return result.data;
}

export const useGetTrack = (id: string) =>
  useQuery({
    queryKey: trackKeys.detail(id),
    queryFn: () => getTrack(id),
    select: (trackDto): SpotifyTrack => ({
      id: trackDto.id,
      uri: trackDto.uri,
      artist: trackDto.artists[0]?.name,
      albumCovers: trackDto.album.images,
      album: trackDto.album.name,
      name: trackDto.name,
      explicit: trackDto.explicit,
      duration: trackDto.duration_ms,
    }),
  });
