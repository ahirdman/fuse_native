import { useMutation } from '@tanstack/react-query';

import { queryClient } from 'lib/query/init';
import { supabase } from 'lib/supabase/supabase.init';
import { showToast } from 'util/toast';

import type { RecievedFriendRequest } from './getFriendRequests';

async function acceptFirendRequest(requestId: number): Promise<void> {
  const { error } = await supabase
    .from('friend_requests')
    .update({ status: 'accepted' })
    .eq('id', requestId);

  if (error) {
    throw new Error(error.message);
  }
}

export const useAcceptFriendRequest = () =>
  useMutation({
    mutationFn: acceptFirendRequest,
    onError: () => {
      showToast({ title: 'Could not accept friend request', preset: 'error' });
    },
    onSuccess: (_, friendRequestId) => {
      queryClient.setQueryData<RecievedFriendRequest[]>(
        ['friendRequests'],
        (prev) => prev?.filter((req) => req.id !== friendRequestId),
      );
    },
  });
