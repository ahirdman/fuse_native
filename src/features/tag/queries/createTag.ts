import { useMutation } from '@tanstack/react-query';

import { queryClient } from 'lib/query/init';
import type { Tables } from 'lib/supabase/database.interface';
import { supabase } from 'lib/supabase/supabase.init';
import { showToast } from 'util/toast';

import { trackTagKeys } from 'track/queries/keys';
import { tagKeys } from './keys';

interface CreateTagArgs {
  color: string;
  name: string;
  trackId?: string;
}

async function createTag({
  color,
  name,
  trackId,
}: CreateTagArgs): Promise<Tables<'tags'>> {
  const { data, error: tagError } = await supabase
    .from('tags')
    .upsert({ color, name })
    .eq('name', name)
    .select()
    .single();

  if (tagError) {
    throw new Error(tagError.message);
  }

  if (!trackId) {
    return data;
  }

  const { error } = await supabase
    .from('trackTags')
    .insert({ track_id: trackId, tag_id: data.id });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const useCreateTag = () =>
  useMutation({
    mutationFn: createTag,
    onError: () => showToast({ title: 'Error creating tag', preset: 'error' }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: trackTagKeys.list(),
      });

      queryClient.invalidateQueries({
        queryKey: tagKeys.lists(data.created_by),
      });
    },
  });
