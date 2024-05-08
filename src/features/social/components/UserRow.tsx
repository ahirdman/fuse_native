import { useQuery } from '@tanstack/react-query';
import { UserAvatar } from 'components/UserAvatar';
import { supabase } from 'lib/supabase/supabase.init';
import { Circle, ListItem, type ListItemProps } from 'tamagui';

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

const useGetAvatarUrl = (avatarUrl?: string | null) =>
  useQuery({
    queryKey: ['avatar', avatarUrl],
    queryFn: avatarUrl ? () => getRemoteAvatarUrl(avatarUrl) : undefined,
    enabled: !!avatarUrl,
  });

interface UserRowProps extends ListItemProps {
  avatarUrl?: string | undefined | null;
  username: string;
}

// TODO:
// - Handle url error with fallback
// - Match avatar size with fallback size
// - Loading state or just fallback
export function UserRow({ avatarUrl, username, ...props }: UserRowProps) {
  const { data } = useGetAvatarUrl(avatarUrl);

  return (
    <ListItem
      icon={data ? <UserAvatar imageUrl={data} /> : <Circle bg="$brandDark" />}
      title={username}
      radiused
      {...props}
    />
  );
}
