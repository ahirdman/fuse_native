import { useMutation } from '@tanstack/react-query';
import { supabase } from 'lib/supabase/supabase.init';
import { showToast } from 'util/toast';

async function sendFriendRequest(friendId: string) {
  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  const { data, error } = await supabase
    .from('friend_requests')
    .insert({
      receiver_user_id: friendId,
      sender_user_id: user.user.id,
      status: 'pending',
    })
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const useSendFriendRequest = () =>
  useMutation({
    mutationFn: sendFriendRequest,
    onError: () => {
      showToast({
        title: 'Could not send friend request',
        preset: 'error',
      });
    },
  });
