import { useQuery } from '@tanstack/react-query';
import { supabase } from 'lib/supabase/supabase.init';

async function getFriends() {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  const { data, error } = await supabase
    .from('user_friends')
    .select('request_id, profiles!inner(id, name)')
    .eq('user_id', userData.user.id);

  if (error) {
    throw new Error(error.message);
  }

  const res = data
    .filter((dto) => dto !== null)
    .filter((profile) => profile !== null)
    .map((dto) => ({ requestID: dto.request_id, ...dto.profiles })) as {
    id: string;
    name: string;
    requestID: number;
  }[];

  return res;
}

export const useGetFriends = () =>
  useQuery({
    queryKey: ['friends'],
    queryFn: getFriends,
  });
