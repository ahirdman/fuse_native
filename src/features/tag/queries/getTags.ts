import { useQuery } from '@tanstack/react-query';

import type { Tables } from 'lib/supabase/database.interface';
import { supabase } from 'lib/supabase/supabase.init';

import { tagKeys } from 'tag/queries/keys';

type TagsWithTrackIdsQuery = {
  color: string;
  created_at: string;
  latest_snapshot_id: string;
  id: number;
  name: string;
  track_ids: string[] | null;
  user_id: string;
};

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

async function getTagsWithTrackIds() {
  const { data, error } = await supabase
    .from('tags_with_track_ids')
    .select()
    .returns<TagsWithTrackIdsQuery[]>();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

interface UseGetTagsWithTrackIdsArgs {
  excledeTrackId: string;
}

export const useGetTagsWithTrackIds = ({
  excledeTrackId,
}: UseGetTagsWithTrackIdsArgs) =>
  useQuery({
    queryKey: tagKeys.list(excledeTrackId),
    queryFn: getTagsWithTrackIds,
    select: (data) =>
      data.filter(
        (tag) => !tag.track_ids?.some((trackId) => trackId === excledeTrackId),
      ),
  });
