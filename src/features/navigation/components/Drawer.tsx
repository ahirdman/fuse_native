import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { UserAvatar } from 'components/UserAvatar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { H6, XStack, YStack } from 'tamagui';

import { selectUserId } from 'auth/auth.slice';
import { Text } from 'components/Text';
import { useGetUser } from 'social/queries/getUser';
import { useAppSelector } from 'store/hooks';

interface AppDrawerProps extends DrawerContentComponentProps {}

export function AppDrawer({ descriptors, navigation, state }: AppDrawerProps) {
  const insets = useSafeAreaInsets();
  const { user, profile } = useAppSelector((state) => state.auth);
  const userId = useAppSelector(selectUserId);
  const { data: userData } = useGetUser(userId);

  const drawerLinks = state.routes.map((route) => {
    return descriptors[route.key];
  });

  return (
    <YStack fullscreen bg="$black" pt={insets.top} pb={insets.bottom} pl={18}>
      <XStack gap={12} ai="center">
        <UserAvatar imageUrl={userData?.avatar_url ?? undefined} />
        <H6>{profile?.username}</H6>
      </XStack>

      <YStack gap={12} flex={1} jc="center">
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
    </YStack>
  );
}
