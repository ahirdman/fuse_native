import { useMutation } from '@tanstack/react-query';
import { queryClient } from 'lib/query/init';
import { supabase } from 'lib/supabase/supabase.init';
import { showToast } from 'util/toast';
import { tagKeys } from './keys';

async function deleteTag(id: number): Promise<void> {
  const { error } = await supabase.from('tags').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}

export const useDeleteTag = () =>
  useMutation({
    mutationFn: deleteTag,
    onError: () => {
      showToast({
        title: 'Error deleting tag',
        preset: 'error',
      });
    },
    onSuccess: (_, tagId) => {
      queryClient.invalidateQueries({
        queryKey: tagKeys.detail(tagId),
      });
    },
  });
