import { useInfiniteQuery } from '@tanstack/react-query';

import { spotifyService } from 'services/spotify.api';

import { trackKeys } from 'track/queries/keys';
import { SpotifyTrack, UserSavedTrackDto } from 'track/track.interface';

interface UserSavedTracksDto {
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: UserSavedTrackDto[];
}

interface UserSavedTracksRes {
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: SpotifyTrack[];
}

async function getSavedTracks(url: string): Promise<UserSavedTracksRes> {
  const result = await spotifyService.get<UserSavedTracksDto>(url, {});

  return { ...result.data, items: sanitizeTracks(result.data.items) };
}

function sanitizeTracks(tracksDto: UserSavedTrackDto[]) {
  return tracksDto.map((trackDto) => ({
    addedAt: trackDto.added_at,
    id: trackDto.track.id,
    uri: trackDto.track.uri,
    artist: trackDto.track.artists[0]?.name,
    albumCovers: trackDto.track.album.images,
    album: trackDto.track.album.name,
    name: trackDto.track.name,
    explicit: trackDto.track.explicit,
    duration: trackDto.track.duration_ms,
  }));
}

export const useInfiniteSavedTracks = (searchString?: string) =>
  useInfiniteQuery({
    queryKey: trackKeys.infinite(),
    queryFn: ({ pageParam }) => getSavedTracks(pageParam),
    initialPageParam: '/me/tracks?offset=0&limit=50',
    getNextPageParam: (params) => params.next,
    select: (data): SpotifyTrack[] => {
      const tracks = data.pages.flatMap((page) => page.items);

      if (!searchString || searchString === '') {
        return tracks;
      }

      const fieldsToMatch = ['album', 'name', 'artist'] as const;

      return tracks.filter((track) =>
        fieldsToMatch.some((field) =>
          track[field]?.toLowerCase().includes(searchString),
        ),
      );
    },
  });
