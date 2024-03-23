import { useMutation } from '@tanstack/react-query';
import { supabase } from 'lib/supabase/supabase.init';

interface UpdatePasswordArgs {
  currentPassword: string;
  newPassword: string;
}

async function updatePassword({
  currentPassword,
  newPassword,
}: UpdatePasswordArgs) {
  const { error } = await supabase.rpc('change_user_password', {
    current_plain_password: currentPassword,
    new_plain_password: newPassword,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export const useUpdatePassword = () =>
  useMutation({
    mutationFn: updatePassword,
  });
