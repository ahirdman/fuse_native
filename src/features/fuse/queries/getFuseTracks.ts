import { useQuery } from '@tanstack/react-query';
import { supabase } from 'lib/supabase/supabase.init';
import {
  getSpotifyTracks,
  sanitizeSpotifyTracks,
} from 'track/queries/getTrack';
import { fuseKeys } from './keys';

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
    .select()
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const { data: tag1TrackIds, error: tag1Error } = await supabase
    .from('trackTags')
    .select('track_id')
    .eq('tag_id', data.tag_id_1);

  if (tag1Error) {
    throw new Error(tag1Error.message);
  }

  const { data: tag2TrackIds, error: tag2Error } = await supabase
    .from('trackTags')
    .select('track_id')
    .eq('tag_id', data.tag_id_2);

  if (tag2Error) {
    throw new Error(tag2Error.message);
  }

  const commonTracks = tag1TrackIds
    .filter(({ track_id: id1 }) =>
      tag2TrackIds.some(({ track_id: id2 }) => id1 === id2),
    )
    .map((item) => item.track_id);

  const result = await getSpotifyTracks(commonTracks);

  return result;
}

export const useGetFuseTracks = ({ id }: { id: number }) =>
  useQuery({
    queryKey: fuseKeys.detail(id),
    queryFn: () => getFuseTracks({ id }),
    select: (data) => sanitizeSpotifyTracks(data),
  });
