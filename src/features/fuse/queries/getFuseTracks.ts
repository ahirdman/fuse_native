import { useQuery } from '@tanstack/react-query';

import { supabase } from 'lib/supabase/supabase.init';

import { fuseKeys } from 'fuse/queries/keys';
import {
  getSpotifyTracks,
  sanitizeSpotifyTracks,
} from 'track/queries/getTrack';

interface GetFuseTracksPreviewArgs {
  initialTagId: number;
  matchedTagId: number;
}

async function getFuseTracksPreview({
  initialTagId,
  matchedTagId,
}: GetFuseTracksPreviewArgs) {
  const { data: initialTagTrackIds, error: initialTagError } = await supabase
    .from('trackTags')
    .select('track_id')
    .eq('tag_id', initialTagId)
    .limit(4);

  if (initialTagError) {
    throw new Error(initialTagError.message);
  }

  const { data: matchedTagTrackIds, error: matchedTagError } = await supabase
    .from('trackTags')
    .select('track_id')
    .eq('tag_id', matchedTagId)
    .limit(4);

  if (matchedTagError) {
    throw new Error(matchedTagError.message);
  }

  const commonTracks = initialTagTrackIds
    .filter(({ track_id: id1 }) =>
      matchedTagTrackIds.some(({ track_id: id2 }) => id1 === id2),
    )
    .map((item) => item.track_id)
    .slice(0, 3);

  const result = await getSpotifyTracks(commonTracks);

  return result;
}

export const useGetFuseTracksPreview = (
  args: GetFuseTracksPreviewArgs | undefined,
) =>
  useQuery({
    queryKey: fuseKeys.details(),
    enabled: !!args,
    queryFn: args ? () => getFuseTracksPreview(args) : undefined,
    select: (data) => sanitizeSpotifyTracks(data),
  });

async function getFuseTracks({ id }: { id: number }) {
  const { error, data } = await supabase
    .from('fuseTags')
    .select(`id, tags (id)`)
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const trackIdSets = await Promise.all(
    data.tags.map(async (id) => {
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

  const trackIds = trackIdSets.flat();
  const result = await getSpotifyTracks(trackIds);

  return result;
}

export const useGetFuseTracks = ({ id }: { id: number }) =>
  useQuery({
    queryKey: fuseKeys.detail(id),
    queryFn: () => getFuseTracks({ id }),
    select: (data) => sanitizeSpotifyTracks(data),
  });
