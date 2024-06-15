import { Pencil } from '@tamagui/lucide-icons';
import type { GestureResponderEvent } from 'react-native';
import { Avatar, type AvatarProps, Circle, View } from 'tamagui';

type AvatarBadge = 'edit';
type AvatarSize = 'small' | 'default' | 'large' | 'xl';

export interface UserAvatarProps extends Omit<AvatarProps, 'size'> {
  imageUrl?: string | undefined;
  size?: AvatarSize | undefined;
  badge?: AvatarBadge | undefined;
}

export function UserAvatar({
  imageUrl,
  badge,
  size = 'default',
  ...props
}: UserAvatarProps) {
  const avatarSize = {
    small: '$3',
    default: '$6',
    large: '$8',
    xl: '$12',
    xxl: '$16',
  }[size];

  return (
    <View>
      <Avatar size={avatarSize} bg="$primary400" circular {...props}>
        <Avatar.Image src={imageUrl} />
        <Avatar.Fallback bg="$brand" />
      </Avatar>
      <AvatarBadge isVisible={!!badge} size={size} onPress={props.onPress} />
    </View>
  );
}

interface AvatarBadgeProps {
  onPress: ((event: GestureResponderEvent) => void) | undefined | null;
  size: AvatarSize;
  isVisible: boolean;
}

function AvatarBadge({ size, isVisible, onPress }: AvatarBadgeProps) {
  if (!isVisible) {
    return null;
  }

  const badgeSize = {
    small: { h: 10, right: 0, bottom: 0 },
    default: { h: 20, right: 0, bottom: 0 },
    large: { h: 25, right: 2.5, bottom: 2.5 },
    xl: { h: 30, right: 7, bottom: 7 },
    xxl: { h: 45, right: 10, bottom: 10 },
  }[size];

  const iconSize = {
    small: 0,
    default: 8,
    large: 12,
    xl: 14,
    xxl: 18,
  }[size];

  return (
    <Circle
      h={badgeSize.h}
      aspectRatio={1}
      position="absolute"
      right={badgeSize.right}
      bottom={badgeSize.bottom}
      bg="$primary500"
      borderWidth={3}
      borderColor="$primary700"
      animation="quick"
      pressStyle={{ scale: 0.9 }}
      onPress={onPress}
    >
      {size !== 'small' && <Pencil size={iconSize} />}
    </Circle>
  );
}
