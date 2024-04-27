import { useQuery } from '@tanstack/react-query';

import { supabase } from 'lib/supabase/supabase.init';

import type { Tag } from 'tag/tag.interface';

async function getInitialTagsWithMatches(): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('initial_tags_with_matches')
    .select()
    .returns<Tag[]>();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

interface MatchedTag extends Tag {
  initial_tag_id: number;
}

async function getMatchedTags(initialTagId: number): Promise<MatchedTag[]> {
  const { data, error } = await supabase
    .from('matched_tags')
    .select()
    .eq('initial_tag_id', initialTagId)
    .returns<MatchedTag[]>();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const useGetInitialTagsWithMatches = () =>
  useQuery({
    queryKey: ['possibleMatches'],
    queryFn: getInitialTagsWithMatches,
  });

export const useGetMatchedTags = (initialTagId?: number) =>
  useQuery({
    queryKey: ['matchedTags'],
    enabled: !!initialTagId,
    queryFn: initialTagId ? () => getMatchedTags(initialTagId) : undefined,
  });
