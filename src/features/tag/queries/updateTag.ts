import { useMutation } from '@tanstack/react-query';
import { Tables } from 'lib/supabase/database.interface';
import { supabase } from 'lib/supabase/supabase.init';
import { showToast } from 'util/toast';

interface UpdateTagArgs {
  id: number;
  name?: string | undefined;
  color?: string | undefined;
}

async function updateTag({ id, name, color }: UpdateTagArgs): Promise<void> {
  const updateObj: Partial<Tables<'tags'>> = {};

  if (name) {
    updateObj.name = name;
  }

  if (color) {
    updateObj.color = color;
  }

  const { error } = await supabase
    .from('tags')
    .update({ ...updateObj })
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}

export const useUpdateTag = () =>
  useMutation({
    mutationKey: ['updateTag'],
    mutationFn: updateTag,
    onError: () => {
      showToast({
        title: 'Error updating tag',
        preset: 'error',
      });
    },
  });
