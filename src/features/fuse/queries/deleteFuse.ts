import { useMutation } from '@tanstack/react-query';

import { queryClient } from 'lib/query/init';
import { supabase } from 'lib/supabase/supabase.init';
import { showToast } from 'util/toast';

import { fuseKeys } from 'fuse/queries/keys';

async function deleteFuse(id: number) {
  const { error } = await supabase.from('fuseTags').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}

export const useDeleteFuse = () =>
  useMutation({
    mutationFn: deleteFuse,
    onError: () => {
      showToast({
        title: 'Error deleting tag',
        preset: 'error',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: fuseKeys.lists(),
      });
    },
  });
