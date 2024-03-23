import { useMutation } from '@tanstack/react-query';
import Purchases from 'react-native-purchases';

import { queryClient } from 'lib/query/init';
import { supabase } from 'lib/supabase/supabase.init';
import { store } from 'store';

import { signOut } from 'user/user.slice';

export async function signOutSupabase() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  await Purchases.logOut();
}

export const useSignOut = () =>
  useMutation({
    mutationFn: signOutSupabase,
    onSuccess: () => {
      store.dispatch(signOut());
      queryClient.clear();
    },
  });
