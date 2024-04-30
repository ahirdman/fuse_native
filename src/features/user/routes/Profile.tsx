import { H1, YStack } from 'tamagui';

import type { DrawerStackScreenProps } from 'navigation.types';

import { UserAvatar } from 'components/UserAvatar';
import { useGetUser } from 'features/social/queries/getUser';

type Props = DrawerStackScreenProps<'Profile'>;

export function Profile({ route }: Props) {
  const { data: user } = useGetUser(route.params.userId);

  return (
    <YStack
      fullscreen
      bg="$primary700"
      px={16}
      pt={84}
      pb={24}
      justifyContent="space-between"
    >
      <YStack gap={16} alignItems="center">
        <UserAvatar imageUrl={undefined} size="large" />

        <H1 fontWeight="bold">{user?.name}</H1>
      </YStack>
    </YStack>
  );
}
