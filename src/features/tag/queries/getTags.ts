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

async function getTags(userId: string): Promise<Tables<'tags'>[]> {
  const { data, error } = await supabase
    .from('tags')
    .select()
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const useGetTags = (userId: string) =>
  useQuery({
    queryKey: tagKeys.lists(), // TODO: Add userId as query key variable
    queryFn: () => getTags(userId),
  });

interface UseGetTagArgs {
  id: number;
}

async function getTag(id: number): Promise<Tables<'tags'>> {
  const { data, error } = await supabase
    .from('tags')
    .select()
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const useGetTag = ({ id }: UseGetTagArgs) =>
  useQuery({
    queryKey: tagKeys.detail(id),
    queryFn: () => getTag(id),
  });

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
