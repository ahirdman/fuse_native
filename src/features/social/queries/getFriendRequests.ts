import { useQuery } from '@tanstack/react-query';

import type { Tables } from 'lib/supabase/database.interface';
import { supabase } from 'lib/supabase/supabase.init';

export interface RecievedFriendRequest {
  id: number;
  created_at: string;
  status: 'pending' | 'rejected' | 'accepted';
  sender_profile: Tables<'profiles'>;
}

async function getFriendRequests(): Promise<RecievedFriendRequest[]> {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  const { data, error } = await supabase
    .from('friend_requests')
    .select(`
        id,
        created_at,
        status,
        sender_profile:profiles!friend_requests_sender_user_id_fkey (id, name)
      `)
    .neq('sender_user_id', userData.user.id)
    .eq('status', 'pending');

  if (error) {
    throw new Error(error.message);
  }

  return data.filter(
    (dto) => dto.sender_profile !== null,
  ) as RecievedFriendRequest[];
}

export const useGetFriendRequests = () =>
  useQuery({
    queryKey: ['friendRequests'],
    queryFn: getFriendRequests,
  });
