import { useMutation } from '@tanstack/react-query';
import { decode } from 'base64-arraybuffer';
import { readAsStringAsync } from 'expo-file-system';
import { queryClient } from 'lib/query/init';
import { supabase } from 'lib/supabase/supabase.init';
import { showToast } from 'util/toast';

interface UpdateAvatarArgs {
  userId: string;
  localAvatarPath: string;
  remoteAvatarUrl: string;
}

function generateShortUUID() {
  return Math.random().toString(36).substring(2, 15);
}

async function updateAvatar(args: UpdateAvatarArgs): Promise<void> {
  const remoteFileName = args.remoteAvatarUrl
    .split('/')
    .find((node) => node.includes('.png'));

  const imageBase64 = await readAsStringAsync(args.localAvatarPath, {
    encoding: 'base64',
  });

  const filePath = `${args.userId}/${remoteFileName}`;
  const newPath = `${args.userId}/${generateShortUUID()}.avatar.png`;

  const { error: storageErrorRemove } = await supabase.storage
    .from('avatars')
    .remove([filePath]);

  if (storageErrorRemove) throw storageErrorRemove;

  const { error: storageErrorInsert } = await supabase.storage
    .from('avatars')
    .upload(newPath, decode(imageBase64), {
      contentType: 'image/png',
    });

  if (storageErrorInsert) throw storageErrorInsert;

  const { error: profileError } = await supabase
    .from('profiles')
    .update({ avatar_url: newPath })
    .eq('id', args.userId);

  if (profileError) throw profileError;
}

export const useUpdateAvatar = () =>
  useMutation({
    mutationFn: updateAvatar,
    onError() {
      showToast({
        title: 'Could not update avatar',
        preset: 'error',
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['getUser'],
      });
    },
  });
