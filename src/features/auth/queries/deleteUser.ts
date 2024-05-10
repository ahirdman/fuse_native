import { useMutation } from '@tanstack/react-query';

import { authSessionStorage, supabase } from 'lib/supabase/supabase.init';

export interface DeleteUserArgs {
  password?: string | undefined;
}

async function deleteUser({ password }: DeleteUserArgs) {
  if (password) {
    const { error: deleteError } = await supabase.rpc(
      'delete_user_with_verification',
      { password },
    );

    if (deleteError) {
      throw new Error(deleteError.message);
    }
  }

  if (!password) {
    const { error: deleteError } = await supabase.rpc('delete_user');

    if (deleteError) {
      throw new Error(deleteError.message);
    }
  }

  authSessionStorage.clearAll();
}

export const useDeleteUser = () =>
  useMutation({
    mutationFn: deleteUser,
  });
