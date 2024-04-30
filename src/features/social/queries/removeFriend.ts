import { useMutation } from '@tanstack/react-query';
import { supabase } from 'lib/supabase/supabase.init';
import { showToast } from 'util/toast';

async function removeFriend(friendReqId: number) {
  const { error } = await supabase
    .from('friend_requests')
    .delete()
    .eq('id', friendReqId);

  if (error) {
    throw new Error(error.message);
  }
}

export const useRemoveFriend = () =>
  useMutation({
    mutationFn: removeFriend,
    onError() {
      showToast({
        title: 'Error removing friend',
        preset: 'error',
      });
    },
  });
