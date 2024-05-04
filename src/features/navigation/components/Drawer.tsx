import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { UserAvatar } from 'components/UserAvatar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, H6, XStack, YStack } from 'tamagui';

import { useSignOut } from 'auth/queries/signOut';
import { ConfirmDialog } from 'components/ConfirmDialog';
import { Text } from 'components/Text';
import { useGetCurrentUserProfile } from 'user/queries/getCurrentUserProfile';

interface AppDrawerProps extends DrawerContentComponentProps {}

export function AppDrawer({ descriptors, navigation, state }: AppDrawerProps) {
  const { data: user } = useGetCurrentUserProfile();
  const { mutate: signOut } = useSignOut();

  const insets = useSafeAreaInsets();

  const drawerLinks = state.routes.map((route) => {
    return descriptors[route.key];
  });

  return (
    <YStack
      fullscreen
      bg="$black"
      pt={insets.top}
      pb={insets.bottom}
      pl={18}
      jc="space-between"
    >
      <XStack gap={12} ai="center">
        <UserAvatar />
        <H6>{user?.name}</H6>
      </XStack>

      <YStack gap={12}>
        {drawerLinks.map((link, index) => {
          if (!link) {
            return null;
          }

          return (
            <XStack key={link.route.key}>
              <Text
                fontSize="$6"
                fontWeight="bold"
                color={state.index === index ? '$brandDark' : '$white'}
                onPress={() => {
                  const params =
                    link.route.name === 'Profile'
                      ? { userId: user?.id }
                      : undefined;
                  navigation.navigate(link.route.name, { params });
                }}
              >
                {link?.route.name}
              </Text>
            </XStack>
          );
        })}
      </YStack>

      <ConfirmDialog
        title="Sign out"
        description="Are you sure?"
        action={() => signOut()}
        renderTrigger={() => <Button unstyled>Sign Out</Button>}
      />
    </YStack>
  );
}
