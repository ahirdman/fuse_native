import { useQuery } from '@tanstack/react-query';

import type { Tables } from 'lib/supabase/database.interface';
import { supabase } from 'lib/supabase/supabase.init';

async function getUsers(): Promise<Tables<'profiles'>[]> {
  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError?.message);
  }

  const { data, error } = await supabase
    .from('profiles')
    .select()
    .neq('id', user.user.id);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const useGetUsers = () =>
  useQuery({
    queryKey: ['getUsers'],
    queryFn: getUsers,
  });
