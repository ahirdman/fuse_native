import { UserAvatar } from 'components/UserAvatar';
import { Circle, ListItem, type ListItemProps } from 'tamagui';

interface UserRowProps extends ListItemProps {
  avatarUrl?: string | undefined;
  username: string;
}

export function UserRow({ avatarUrl, username, ...props }: UserRowProps) {
  return (
    <ListItem
      icon={
        avatarUrl ? (
          <UserAvatar imageUrl={avatarUrl} />
        ) : (
          <Circle bg="$brandDark" />
        )
      }
      title={username}
      radiused
      {...props}
    />
  );
}
