import { useQuery } from '@tanstack/react-query';

import type { Tables } from 'lib/supabase/database.interface';
import { supabase } from 'lib/supabase/supabase.init';

import { tagKeys } from 'tag/queries/keys';

async function getTags(): Promise<Tables<'tags'>[]> {
  const { data, error } = await supabase.from('tags').select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const useGetTags = <T = Tables<'tags'>[]>(
  select?: (data: Tables<'tags'>[]) => T,
) =>
  useQuery({
    queryKey: tagKeys.lists(),
    queryFn: getTags,
    select,
  });

interface UseGetTagArgs {
  id: number;
}

export const useGetTag = ({ id }: UseGetTagArgs) =>
  useGetTags((data) => data.find((tag) => tag.id === id));
