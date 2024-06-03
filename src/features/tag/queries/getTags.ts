import { useQuery } from '@tanstack/react-query';
import { fuseKeys } from 'fuse/queries/keys';

import type {
  Enums,
  Tables,
  UntionFuseTable,
  UntionTagTable,
} from 'lib/supabase/database.interface';
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
    .eq('created_by', userId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const useGetTags = (userId: string) =>
  useQuery({
    queryKey: tagKeys.lists(userId),
    queryFn: () => getTags(userId),
  });

interface UseGetTagArgs {
  id: number;
  type: Enums<'tag_type'>;
}

async function getTag({
  id,
  type,
}: UseGetTagArgs): Promise<UntionTagTable | UntionFuseTable> {
  if (type === 'tag') {
    const { data, error } = await supabase
      .from('tags')
      .select()
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { ...data, type: 'tag' };
  }

  if (type === 'fuse') {
    const { data, error } = await supabase
      .from('fuseTags')
      .select(`
      *,
      tags (id, name, color)
    `)
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { ...data, type: 'fuse' };
  }

  throw new Error('Empty result');
}

export const useGetTag = (args: UseGetTagArgs) =>
  useQuery({
    queryKey:
      args.type === 'tag' ? tagKeys.detail(args.id) : fuseKeys.detail(args.id),
    queryFn: () => getTag(args),
  });

async function getTagsWithTrackIds(userId: string) {
  const { data, error } = await supabase
    .from('tags_with_track_ids')
    .select()
    .eq('user_id', userId)
    .returns<TagsWithTrackIdsQuery[]>();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

interface UseGetTagsWithTrackIdsArgs {
  excledeTrackId: string;
  userId: string;
}

export const useGetTagsWithTrackIds = ({
  excledeTrackId,
  userId,
}: UseGetTagsWithTrackIdsArgs) =>
  useQuery({
    queryKey: tagKeys.list(userId, excledeTrackId),
    queryFn: () => getTagsWithTrackIds(userId),
    select: (data) =>
      data.filter(
        (tag) => !tag.track_ids?.some((trackId) => trackId === excledeTrackId),
      ),
  });
