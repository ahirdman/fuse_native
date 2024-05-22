import { useQuery } from '@tanstack/react-query';
import type { Tables } from 'lib/supabase/database.interface';
import { supabase } from 'lib/supabase/supabase.init';

async function getPendingFriendRequests(
  userId: string,
): Promise<Tables<'profiles'>[]> {
  const { data, error } = await supabase
    .from('friend_requests')
    .select(`
        sender_profile:profiles!friend_requests_receiver_user_id_fkey (id, name, avatar_url)
  `)
    .neq('status', 'accepted')
    .eq('sender_user_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  const res = data
    .filter((dto) => dto !== null)
    .map((profile) => profile.sender_profile) as Tables<'profiles'>[];

  return res;
}

export const useGetPendingFriendRequests = (userId: string) =>
  useQuery({
    queryKey: ['friendRequestsSent'],
    queryFn: () => getPendingFriendRequests(userId),
  });
