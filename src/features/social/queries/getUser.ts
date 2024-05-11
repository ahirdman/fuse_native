import { useQuery } from '@tanstack/react-query';

//import type { Tables } from 'lib/supabase/database.interface';
import { supabase } from 'lib/supabase/supabase.init';
import type { UsersView } from './getUsers';

// async function getUser(userId: string): Promise<Tables<'profiles'>> {
//   const { data, error } = await supabase
//     .from('profiles')
//     .select()
//     .eq('id', userId)
//     .single();
//
//   if (error) {
//     throw new Error(error.message);
//   }
//
//   return data;
// }

async function getUserV2(userId: string): Promise<UsersView> {
  const { data, error } = await supabase
    .from('users_with_relation')
    .select()
    .eq('id', userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as UsersView;
}

export const useGetUser = (userId: string) =>
  useQuery({
    queryKey: ['getUser', userId],
    queryFn: () => getUserV2(userId),
  });
