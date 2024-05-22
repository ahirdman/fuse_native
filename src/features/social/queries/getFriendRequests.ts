import { useQuery } from '@tanstack/react-query';

import type { Tables } from 'lib/supabase/database.interface';
import { supabase } from 'lib/supabase/supabase.init';

export interface RecievedFriendRequest {
  id: number;
  created_at: string;
  status: 'pending' | 'rejected' | 'accepted';
  sender_profile: Tables<'profiles'>;
}

async function getFriendRequests(
  userId: string,
): Promise<RecievedFriendRequest[]> {
  const { data, error } = await supabase
    .from('friend_requests')
    .select(`
        id,
        created_at,
        status,
        sender_profile:profiles!friend_requests_sender_user_id_fkey (id, name, avatar_url)
      `)
    .neq('sender_user_id', userId)
    .eq('status', 'pending');

  if (error) {
    throw new Error(error.message);
  }

  return data.filter(
    (dto) => dto.sender_profile !== null,
  ) as RecievedFriendRequest[];
}

export const useGetFriendRequests = <T = RecievedFriendRequest[]>(
  userId: string,
  select?: (data: RecievedFriendRequest[]) => T,
) =>
  useQuery({
    queryKey: ['friendRequests'],
    queryFn: () => getFriendRequests(userId),
    select,
  });

interface IsPendingRequestArgs {
  userId: string;
  profileId: string;
}

export const useIsPendingRequest = ({
  userId,
  profileId,
}: IsPendingRequestArgs) =>
  useGetFriendRequests(userId, (data) =>
    data.find((request) => request.sender_profile.id === profileId),
  );
