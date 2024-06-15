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

  return data
    .filter((dto) => dto !== null)
    .map((profile) => {
      const publicAvatarUrl = profile.sender_profile?.avatar_url
        ? supabase.storage.from('avatars').getPublicUrl(profile.sender_profile.avatar_url)
          .data.publicUrl
        : undefined


      return { ...profile.sender_profile, avatar_url: publicAvatarUrl } as Tables<'profiles'>
    })
}

export const useGetPendingFriendRequests = (userId: string) =>
  useQuery({
    queryKey: ['friendRequestsSent'],
    queryFn: () => getPendingFriendRequests(userId),
  });
