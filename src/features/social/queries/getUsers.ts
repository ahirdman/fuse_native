import { useQuery } from '@tanstack/react-query';

import type { Tables } from 'lib/supabase/database.interface';
import { supabase } from 'lib/supabase/supabase.init';

export type UserRelation = 'friend' | 'requested_by' | 'requested_to' | 'none';

export interface UsersView extends Tables<'profiles'> {
  relation: UserRelation;
}

interface GetUsersArg {
  searchQuery: string;
}

async function seratchUsers({
  searchQuery,
}: GetUsersArg): Promise<UsersView[]> {
  if (searchQuery.length === 0) {
    return Promise.resolve([]);
  }

  const { data, error } = await supabase
    .from('users_with_relation')
    .select()
    .ilike('name', `%${searchQuery}%`);

  if (error) {
    throw new Error(error.message);
  }

  return data as UsersView[];
}

export const useSearchUsers = (args: GetUsersArg) =>
  useQuery({
    queryKey: ['getUsers', args.searchQuery],
    queryFn: () => seratchUsers(args),
  });
