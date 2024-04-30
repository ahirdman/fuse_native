import { View } from 'tamagui';

import { UserAvatar, type UserAvatarProps } from 'components/UserAvatar';

interface Props extends UserAvatarProps {
  onPress(): void;
}

export function AvatarButton({ onPress, ...props }: Props) {
  return (
    <View onPress={onPress}>
      <UserAvatar size="small" {...props} />
    </View>
  );
}
