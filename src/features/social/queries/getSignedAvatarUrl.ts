import { useQuery } from '@tanstack/react-query';
import { supabase } from 'lib/supabase/supabase.init';

// TODO: Find more performant way of getting signed urls
async function getRemoteAvatarUrl(filePath: string) {
  const { error, data } = await supabase.storage
    .from('avatars')
    .createSignedUrl(filePath, 60);

  if (error) {
    throw error;
  }

  return data.signedUrl;
}

export const useGetAvatarUrl = (avatarUrl?: string | null) =>
  useQuery({
    queryKey: ['avatar', avatarUrl],
    queryFn: avatarUrl ? () => getRemoteAvatarUrl(avatarUrl) : undefined,
    enabled: !!avatarUrl,
  });
