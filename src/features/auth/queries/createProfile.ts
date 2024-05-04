import { useMutation } from '@tanstack/react-query';
import { decode } from 'base64-arraybuffer';
import { readAsStringAsync } from 'expo-file-system';
import { z } from 'zod';

import { supabase } from 'lib/supabase/supabase.init';
import { showToast } from 'util/toast';

const profileSchmea = z.object({
  username: z
    .string()
    .min(2, { message: 'Username cannot be shorter than 2 characters' })
    .max(24, { message: 'Username cannot be longer than 24 characters' }),
  avatarUrl: z.string().url().optional(),
});

type Profile = z.infer<typeof profileSchmea>;

async function createProfile({ username, avatarUrl }: Profile): Promise<void> {
  const { error: userError, data: userData } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  const userId = userData.user.id;

  const { error: profileError } = await supabase
    .from('profiles')
    .insert({ name: username });

  if (profileError) {
    throw new Error(profileError.message);
  }

  if (!avatarUrl) {
    return;
  }

  const imageBase64 = await readAsStringAsync(avatarUrl, {
    encoding: 'base64',
  });

  const { error: storageError, data } = await supabase.storage
    .from('avatars')
    .upload(`${userId}/avatar.png`, decode(imageBase64));

  if (storageError) {
    throw new Error(storageError.message);
  }

  const { error } = await supabase
    .from('profiles')
    .update({ avatar_url: data.path })
    .eq('id', userId);

  if (error) {
    throw new Error(error.message);
  }
}

const useCreateProfile = () =>
  useMutation({
    mutationFn: createProfile,
    onError: () => {
      showToast({
        title: 'Error creating profile',
        preset: 'error',
      });
    },
  });

export { useCreateProfile, profileSchmea, type Profile };
