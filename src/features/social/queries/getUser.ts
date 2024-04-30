import { useQuery } from '@tanstack/react-query';

import type { Tables } from 'lib/supabase/database.interface';
import { supabase } from 'lib/supabase/supabase.init';

async function getUser(userId: string): Promise<Tables<'profiles'>> {
  const { data, error } = await supabase
    .from('profiles')
    .select()
    .eq('id', userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const useGetUser = (userId: string) =>
  useQuery({
    queryKey: ['getUser', userId],
    queryFn: () => getUser(userId),
  });
