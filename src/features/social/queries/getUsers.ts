import { useQuery } from '@tanstack/react-query';

import type { Tables } from 'lib/supabase/database.interface';
import { supabase } from 'lib/supabase/supabase.init';

export type UserRelation = 'friend' | 'requested_by' | 'requested_to' | 'none';

export interface UsersView extends Tables<'profiles'> {
  relation: UserRelation;
}

async function getUsers(): Promise<UsersView[]> {
  const { data, error } = await supabase.from('users_with_relation').select();

  if (error) {
    throw new Error(error.message);
  }

  return data as UsersView[];
}

export const useGetUsers = () =>
  useQuery({
    queryKey: ['getUsers'],
    queryFn: getUsers,
  });
