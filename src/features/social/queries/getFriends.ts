import { useQuery } from '@tanstack/react-query';
import { supabase } from 'lib/supabase/supabase.init';

async function getFriends(userId: string) {
  const { data, error } = await supabase
    .from('user_friends')
    .select('request_id, profiles!inner(id, name, avatar_url)')
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  const res = data
    .filter((dto) => dto !== null)
    .filter((profile) => profile !== null)
    .map((dto) => ({
      ...dto.profiles,
      requestID: dto.request_id,
      avatar_url: dto.profiles.avatar_url
        ? supabase.storage.from('avatars').getPublicUrl(dto.profiles.avatar_url)
            .data.publicUrl
        : undefined,
    })) as {
    id: string;
    name: string;
    avatar_url: string | null;
    requestID: number;
  }[];

  return res;
}

export const useGetFriends = (userId: string) =>
  useQuery({
    queryKey: ['friends', userId],
    queryFn: () => getFriends(userId),
  });
