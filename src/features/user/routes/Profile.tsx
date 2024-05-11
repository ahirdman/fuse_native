import { FlashList } from '@shopify/flash-list';
import { Button, H1, YStack } from 'tamagui';

import type { Tables } from 'lib/supabase/database.interface';
import type { DrawerStackScreenProps } from 'navigation.types';

import { Text } from 'components/Text';
import { UserAvatar } from 'components/UserAvatar';
import { useGetUser } from 'features/social/queries/getUser';
import { useGetAvatarUrl } from 'social/queries/getSignedAvatarUrl';
import type { UsersView } from 'social/queries/getUsers';
import { TagRow } from 'tag/components/TagRow';
import { useGetTags } from 'tag/queries/getTags';

type Props = DrawerStackScreenProps<'Profile'>;

export function Profile({ route }: Props) {
  const { data: user } = useGetUser(route.params.userId);
  const { data: avatarUrl } = useGetAvatarUrl(user?.avatar_url);

  const isFriend = user?.relation === 'friend';

  return (
    <YStack
      fullscreen
      bg="$primary700"
      px={16}
      pb={24}
      justifyContent="space-between"
    >
      <YStack gap={16} alignItems="center">
        <UserAvatar imageUrl={avatarUrl} size="xl" />

        <H1 fontWeight="bold">{user?.name}</H1>
      </YStack>

      {isFriend ? (
        <FriendProfile user={user} />
      ) : (
        <NonFriendProfile user={user} />
      )}
    </YStack>
  );
}

type ProfileProps = { user: UsersView };

function FriendProfile({ user }: ProfileProps) {
  const { data } = useGetTags(user.id);

  function renderItem({ item }: { item: Tables<'tags'> }) {
    return <TagRow color={item.color} name={item.name} />;
  }

  return (
    <YStack flex={1}>
      <FlashList
        data={data}
        renderItem={renderItem}
        estimatedItemSize={100}
        ListEmptyComponent={<Text textAlign="center">No tags</Text>}
      />
    </YStack>
  );
}

function NonFriendProfile({ user }: Partial<ProfileProps>) {
  return (
    <YStack>
      <Text>Not a friend</Text>

      <Button>Send Friend Request to {user?.name}</Button>
    </YStack>
  );
}
