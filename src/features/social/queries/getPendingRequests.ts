import { useQuery } from '@tanstack/react-query';
import type { Tables } from 'lib/supabase/database.interface';
import { supabase } from 'lib/supabase/supabase.init';

async function getPendingFriendRequests(): Promise<Tables<'profiles'>[]> {
  const { data: currentUser, error: currentUserError } =
    await supabase.auth.getUser();

  if (currentUserError) {
    throw new Error(currentUserError.message);
  }

  const { data, error } = await supabase
    .from('friend_requests')
    .select(`
        sender_profile:profiles!friend_requests_receiver_user_id_fkey (id, name)
  `)
    .neq('status', 'accepted')
    .eq('sender_user_id', currentUser.user.id);

  if (error) {
    throw new Error(error.message);
  }

  const res = data
    .filter((dto) => dto !== null)
    .map((profile) => profile.sender_profile) as Tables<'profiles'>[];

  return res;
}

export const useGetPendingFriendRequests = () =>
  useQuery({
    queryKey: ['friendRequestsSent'],
    queryFn: getPendingFriendRequests,
  });
