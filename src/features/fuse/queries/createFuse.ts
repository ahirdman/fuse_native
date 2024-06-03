import { useMutation } from '@tanstack/react-query';
import { queryClient } from 'lib/query/init';

import { supabase } from 'lib/supabase/supabase.init';
import { showToast } from 'util/toast';
import { fuseKeys } from './keys';

interface CreateFuseTagArgs {
  tagIds: number[];
  name: string;
}

async function createFuseTag({ tagIds, name }: CreateFuseTagArgs) {
  if (tagIds.length < 2) {
    throw new Error('Creating a fuse requires at least two tags');
  }

  const { data, error } = await supabase
    .from('fuseTags')
    .insert({ name })
    .select('id')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const fuseTagTagsData = tagIds.map((tagId) => ({
    fuse_id: data.id,
    tag_id: tagId,
  }));

  const { error: fuseTagTagsError } = await supabase
    .from('fusetagtags')
    .insert(fuseTagTagsData);

  if (fuseTagTagsError) {
    throw new Error(fuseTagTagsError.message);
  }

  return data;
}

export const useCreateFuseTag = () =>
  useMutation({
    mutationFn: createFuseTag,
    onError: () => {
      showToast({
        title: 'Something went wrong',
        preset: 'error',
        message: 'Could not create playlist',
      });
    },
    onSuccess: () => {
      showToast({
        title: 'Fuse created',
        preset: 'done',
      });
      queryClient.invalidateQueries({
        queryKey: fuseKeys.lists(),
      });
    },
  });
