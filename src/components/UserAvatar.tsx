import { Avatar, type AvatarProps } from 'tamagui';

export interface UserAvatarProps extends Omit<AvatarProps, 'size'> {
  imageUrl?: string | undefined;
  size?: 'small' | 'default' | 'large' | undefined;
}

export function UserAvatar({ imageUrl, size = 'default' }: UserAvatarProps) {
  const avatarSize = size === 'large' ? '$8' : size === 'small' ? '$3' : '$6';

  return (
    <Avatar
      size={avatarSize}
      borderWidth={1}
      borderColor="$border300"
      bg="$primary400"
      circular
    >
      <Avatar.Image src={imageUrl} />
      <Avatar.Fallback bc="$brand" />
    </Avatar>
  );
}
