import { useQuery } from '@tanstack/react-query';
import { Tables } from 'lib/supabase/database.interface';
import { supabase } from 'lib/supabase/supabase.init';

interface GetFriendsRes extends Tables<"profiles"> {
  requestID: number
}

async function getFriends(userId: string) {
  const { data, error } = await supabase
    .from('user_friends')
    .select('request_id, profiles!inner(id, name, avatar_url)')
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  return data
    .filter((dto) => dto !== null)
    .filter((profile) => profile !== null)
    .map((dto) => {
      const publicAvatarUrl = dto.profiles.avatar_url
        ? supabase.storage.from('avatars').getPublicUrl(dto.profiles.avatar_url)
          .data.publicUrl
        : undefined

      return {
        ...dto.profiles,
        requestID: dto.request_id,
        avatar_url: publicAvatarUrl
      }
    }) as GetFriendsRes[];
}

export const useGetFriends = (userId: string) =>
  useQuery({
    queryKey: ['friends', userId],
    queryFn: () => getFriends(userId),
  });
