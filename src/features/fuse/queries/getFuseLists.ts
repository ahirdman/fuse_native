import type { QueryData } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';

import { supabase } from 'lib/supabase/supabase.init';

import { fuseKeys } from './keys';

// NOTE: Seems wierd to be able to have to defined an expression for a type
const fuseWithRelatedTagsQuery = supabase.from('fuseTags').select(`
      *,
      tags (id, name, color)
    `);

const singleQueryType = fuseWithRelatedTagsQuery.single();

export type FuseTagWithSubTags = QueryData<typeof singleQueryType>;

async function getFuseLists(): Promise<FuseTagWithSubTags[]> {
  const { data, error } = await supabase.from('fuseTags').select(`
      *,
      tags (id, name, color)
    `);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const useGetFuseLists = <T = FuseTagWithSubTags[]>(
  select?: (data: FuseTagWithSubTags[]) => T,
) =>
  useQuery({
    queryKey: fuseKeys.lists(),
    queryFn: getFuseLists,
    select,
  });

export const useGetFuseList = ({ id }: { id: number }) =>
  useGetFuseLists((data) => data.find((fuse) => fuse.id === id));
