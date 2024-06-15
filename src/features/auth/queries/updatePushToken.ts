import { supabase } from 'lib/supabase/supabase.init';

interface UpdatePushTokenArgs {
  userId: string;
  pushToken: string;
}

export async function updatePushToken({
  userId,
  pushToken,
}: UpdatePushTokenArgs): Promise<void> {
  const { error } = await supabase
    .from('accounts')
    .update({ pushToken })
    .eq('id', userId);

  if (error) throw error;
}
