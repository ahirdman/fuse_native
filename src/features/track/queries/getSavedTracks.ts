import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { supabase } from 'lib/supabase/supabase.init';

import { spotifyService } from 'services/spotify.api';

import { trackKeys, trackTagKeys } from 'track/queries/keys';
import type { SpotifyTrack, UserSavedTrackDto } from 'track/track.interface';

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

interface SavedTracksArgs {
  searchString?: string;
  trackIds?: string[];
  filterTaggedTracks: boolean;
}

export const useInfiniteSavedTracks = (args: SavedTracksArgs) =>
  useInfiniteQuery({
    queryKey: trackKeys.infinite(),
    queryFn: ({ pageParam }) => getSavedTracks(pageParam),
    initialPageParam: '/me/tracks?offset=0&limit=50',
    getNextPageParam: (params) => params.next,
    enabled: !!args.trackIds,
    select: (data) =>
      selectTracksWithFilters({
        data: data.pages,
        ...args,
      }),
  });

function selectTracksWithFilters({
  data,
  filterTaggedTracks,
  trackIds,
  searchString,
}: SavedTracksArgs & { data: UserSavedTracksRes[] }): SpotifyTrack[] {
  const tracks = data.flatMap((page) => page.items);

  const fieldsToMatch = ['album', 'name', 'artist'] as const;

  return tracks.filter((track) => {
    const isTrackVisible = !filterTaggedTracks || !trackIds?.includes(track.id);

    if (trackIds?.includes(track.id)) {
      track.isTagged = true;
    }

    const doesTrackMatchSearch =
      !searchString ||
      fieldsToMatch.some((field) =>
        track[field]?.toLowerCase().includes(searchString.toLowerCase()),
      );

    return isTrackVisible && doesTrackMatchSearch;
  });
}

interface GetTagedTrackIdsRes {
  track_id: string | null;
}

interface GetTaggedTrackIdsArgs {
  userId: string;
}

async function getTagedTrackIds({
  userId,
}: GetTaggedTrackIdsArgs): Promise<GetTagedTrackIdsRes[]> {
  const { error, data } = await supabase
    .from('track_tags_view')
    .select()
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

function sanitizeTrackIds(data: GetTagedTrackIdsRes[]): string[] {
  return data
    .filter((item): item is { track_id: string } => item.track_id !== null)
    .map((item) => item.track_id);
}

export const useGetTaggedTrackIds = (args: GetTaggedTrackIdsArgs) =>
  useQuery({
    queryKey: [...trackTagKeys.list(), args.userId],
    queryFn: () => getTagedTrackIds(args),
    select: (data) => sanitizeTrackIds(data),
  });
