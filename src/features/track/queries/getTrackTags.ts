import { useQuery } from '@tanstack/react-query';
import { Tables } from 'lib/supabase/database.interface';
import { supabase } from 'lib/supabase/supabase.init';
import { trackTagKeys } from './keys';

interface GetTrackTagsArgs {
  trackId: string;
}

async function getTrackTags({
  trackId,
}: GetTrackTagsArgs): Promise<NonNullable<Tables<'tags'>[]>> {
  const { data, error } = await supabase
    .from('trackTags')
    .select('tags(*)')
    .eq('track_id', trackId);

  if (error) {
    throw new Error(error.message);
  }

  const transformedData = data
    .map((item) => item.tags)
    .filter((item): item is NonNullable<Tables<'tags'>> => item !== null);

  return transformedData;
}

export const useGetTrackTags = (trackId: string) =>
  useQuery({
    queryKey: trackTagKeys.track(trackId),
    queryFn: () => getTrackTags({ trackId }),
  });
