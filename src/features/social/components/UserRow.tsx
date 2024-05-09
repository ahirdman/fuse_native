import { Circle, ListItem, type ListItemProps } from 'tamagui';

import { UserAvatar } from 'components/UserAvatar';
import { useGetAvatarUrl } from 'social/queries/getSignedAvatarUrl';

interface UserRowProps extends ListItemProps {
  avatarUrl?: string | undefined | null;
  username: string;
}

// TODO: User row avatar image
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
