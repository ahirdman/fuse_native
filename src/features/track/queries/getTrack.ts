import { useQuery } from '@tanstack/react-query';

import { spotifyService } from 'services/spotify.api';

import { trackKeys } from 'track/queries/keys';
import type { SpotifyTrack, SpotifyTrackDto } from 'track/track.interface';

async function getSpotifyTrack(id: string) {
  const result = await spotifyService.get<SpotifyTrackDto>(`/tracks/${id}`);

  return result.data;
}

interface GetSpotifyTracksRes {
  tracks: SpotifyTrackDto[];
}

export async function getSpotifyTracks(
  trackIds: string[],
): Promise<SpotifyTrackDto[]> {
  if (trackIds.length > 100) {
    throw new Error(
      `Too many track ids, max amount: 100 [Recovied: ${trackIds.length}]`,
    );
  }

  const result = await spotifyService.get<GetSpotifyTracksRes>(
    `/tracks?ids=${trackIds.join(',')}`,
  );

  return result.data.tracks;
}

export function sanitizeSpotifyTracks(data: SpotifyTrackDto[]): SpotifyTrack[] {
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

export const useGetTrack = (id: string) =>
  useQuery({
    queryKey: trackKeys.detail(id),
    queryFn: () => getSpotifyTrack(id),
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
