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
    .map((dto) => ({ requestID: dto.request_id, ...dto.profiles })) as {
    id: string;
    name: string;
    avatar_url: string | null;
    requestID: number;
  }[];

  return res;
}

export const useGetFriends = (userId: string) =>
  useQuery({
    queryKey: ['friends'],
    queryFn: () => getFriends(userId),
  });
