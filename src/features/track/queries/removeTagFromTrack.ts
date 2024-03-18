import { useMutation } from '@tanstack/react-query';
import { queryClient } from 'lib/query/init';
import { supabase } from 'lib/supabase/supabase.init';
import { showToast } from 'util/toast';
import { trackTagKeys } from './keys';

interface RemoveTagFromTrackArgs {
  tagId: number;
  trackId: string;
}

async function removeTagFromTrack({ tagId, trackId }: RemoveTagFromTrackArgs) {
  const { error } = await supabase
    .from('trackTags')
    .delete()
    .eq('tag_id', tagId)
    .eq('track_id', trackId);

  if (error) {
    throw new Error(error.message);
  }

  const { error: updatedAtError } = await supabase
    .from('tags')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', tagId);

  if (updatedAtError) {
    throw new Error(updatedAtError.message);
  }
}

export const useRemoveTagFromTrack = () =>
  useMutation({
    mutationFn: removeTagFromTrack,
    onError: () => {
      showToast({
        title: 'Something went wrong',
        preset: 'error',
        message: 'Could not delete tag',
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: trackTagKeys.track(variables.trackId),
      });
    },
  });
