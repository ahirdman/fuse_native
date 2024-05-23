import { useMutation } from '@tanstack/react-query';
import { queryClient } from 'lib/query/init';

import { supabase } from 'lib/supabase/supabase.init';
import { showToast } from 'util/toast';
import { fuseKeys } from './keys';

interface CreateFuseTagArgs {
  initialTagId: number;
  matchedTagId: number;
}

async function createFuseTag({
  initialTagId,
  matchedTagId,
}: CreateFuseTagArgs) {
  const { data: tag1, error: tag1Error } = await supabase
    .from('tags')
    .select()
    .eq('id', initialTagId)
    .single();
  const { data: tag2, error: tag2Error } = await supabase
    .from('tags')
    .select()
    .eq('id', matchedTagId)
    .single();

  if (tag1Error || tag2Error) {
    throw new Error(tag1Error?.message);
  }

  const { data, error } = await supabase
    .from('fuseTags')
    .insert({
      tag_id_1: initialTagId,
      tag_id_2: matchedTagId,
      name: `${tag1.name} ${tag2.name}`,
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const useCreateFuseTag = () =>
  useMutation({
    mutationFn: createFuseTag,
    onError: (error) => {
      console.debug(error);
      showToast({
        title: 'Something went wrong',
        preset: 'error',
        message: 'Could not create playlist',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: fuseKeys.lists(),
      });
    },
  });
