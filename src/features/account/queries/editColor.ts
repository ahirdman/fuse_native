import { useMutation } from '@tanstack/react-query';
import { supabase } from 'lib/supabase/supabase.init';

interface EditProfileColorArgs {
  color: string;
  userId: string;
}

async function editProfileColor(args: EditProfileColorArgs): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ profile_color: args.color })
    .eq('id', args.userId);

  if (error) {
    throw error;
  }
}

export const useEditProfileColor = () =>
  useMutation({
    mutationFn: editProfileColor,
  });
