import { useQuery } from '@tanstack/react-query';
import type { Tables } from 'lib/supabase/database.interface';
import { supabase } from 'lib/supabase/supabase.init';
import { trackTagKeys } from './keys';

interface GetTrackTagsArgs {
  trackId: string;
  userId: string;
}

async function getTrackTags({
  trackId,
  userId,
}: GetTrackTagsArgs): Promise<NonNullable<Tables<'tags'>[]>> {
  const { data, error } = await supabase
    .from('trackTags')
    .select('tags(*)')
    .eq('track_id', trackId)
    .eq('user_id', userId);

  console.log('TRACKS', JSON.stringify(data, null, 2));

  if (error) {
    throw new Error(error.message);
  }

  const transformedData = data
    .map((item) => item.tags)
    .filter((item): item is NonNullable<Tables<'tags'>> => item !== null);

  return transformedData;
}

export const useGetTrackTags = ({ userId, trackId }: GetTrackTagsArgs) =>
  useQuery({
    queryKey: trackTagKeys.track(trackId),
    queryFn: () => getTrackTags({ trackId, userId }),
  });
