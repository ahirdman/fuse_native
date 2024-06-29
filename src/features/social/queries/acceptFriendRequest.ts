import { useMutation } from '@tanstack/react-query';

import { queryClient } from 'lib/query/init';
import { supabase } from 'lib/supabase/supabase.init';
import { showToast } from 'util/toast';

export interface FriendRequestResponseArgs {
  requestId: number;
  status: 'accepted' | 'rejected';
}

async function friendRequestResponse({
  requestId,
  status,
}: FriendRequestResponseArgs): Promise<void> {
  const { error } = await supabase
    .from('friend_requests')
    .update({ status })
    .eq('id', requestId);

  if (error) {
    throw new Error(error.message);
  }
}

export const useAcceptFriendRequest = () =>
  useMutation({
    mutationFn: friendRequestResponse,
    onError: () => {
      showToast({ title: 'Could not accept friend request', preset: 'error' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['friendRequests'],
      });

      queryClient.invalidateQueries({
        queryKey: ['friends'],
      });
    },
  });
