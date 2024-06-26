import { useMutation } from '@tanstack/react-query';
import { queryClient } from 'lib/query/init';
import { supabase } from 'lib/supabase/supabase.init';
import { showToast } from 'util/toast';

async function removeFriend(friendUserId: string) {
  const { error: userError, data } = await supabase.from("user_friends").select("request_id").eq("friend_user_id", friendUserId).single()

  if (userError) throw userError

  const { error } = await supabase
    .from('friend_requests')
    .delete()
    .eq('id', data.request_id);

  if (error) throw error
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
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["friends"]
      })
    },
  });
