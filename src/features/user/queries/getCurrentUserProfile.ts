import { useQuery } from '@tanstack/react-query';

import { supabase } from 'lib/supabase/supabase.init';

async function getCurrentUserProfile() {
  const { data: authUser, error: authError } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(authError.message);
  }

  const { data, error } = await supabase
    .from('profiles')
    .select()
    .eq('id', authUser.user.id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const useGetCurrentUserProfile = () =>
  useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUserProfile,
  });
