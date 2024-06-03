import { FlashList } from '@shopify/flash-list';
import { Check, X } from '@tamagui/lucide-icons';
import { Button, H1, XStack, YStack } from 'tamagui';

import type { Tables } from 'lib/supabase/database.interface';
import type { FriendsTabScreenProps } from 'navigation.types';

import { selectUserId } from 'auth/auth.slice';
import { Alert } from 'components/Alert';
import { Text } from 'components/Text';
import { UserAvatar } from 'components/UserAvatar';
import { useGetUser } from 'features/social/queries/getUser';
import { useAcceptFriendRequest } from 'social/queries/acceptFriendRequest';
import { useIsPendingRequest } from 'social/queries/getFriendRequests';
import { useGetAvatarUrl } from 'social/queries/getSignedAvatarUrl';
import type { UsersView } from 'social/queries/getUsers';
import { useSendFriendRequest } from 'social/queries/sendFriendRequest';
import { useAppSelector } from 'store/hooks';
import { TagRow } from 'tag/components/TagRow';
import { useGetTags } from 'tag/queries/getTags';
import { showToast } from 'util/toast';

type Props = FriendsTabScreenProps<'Profile'>;

export function Profile({ route, navigation }: Props) {
  const { data: user } = useGetUser(route.params.userId);
  const { data: avatarUrl } = useGetAvatarUrl(user?.avatar_url);

  const isFriend = user?.relation === 'friend';

  function onTagPresa(id: number, name: string, color: string) {
    navigation.push('Tag', { id, name, color, type: 'tag' });
  }

  if (!user) {
    return (
      <YStack
        fullscreen
        bg="$primary700"
        px={16}
        pb={24}
        justifyContent="space-between"
      >
        <Alert label="Something went wrong" type="error" />
      </YStack>
    );
  }

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

        <H1 fontWeight="bold">{user.name}</H1>
      </YStack>

      {isFriend ? (
        <FriendProfile user={user} onTagPress={onTagPresa} />
      ) : (
        <NonFriendProfile user={user} />
      )}
    </YStack>
  );
}

type ProfileProps = { user: UsersView };

function FriendProfile({
  user,
  onTagPress,
}: ProfileProps & {
  onTagPress(id: number, name: string, color: string): void;
}) {
  const { data } = useGetTags(user.id);

  function renderItem({ item }: { item: Tables<'tags'> }) {
    return (
      <TagRow
        color={item.color}
        name={item.name}
        onPress={() => onTagPress(item.id, item.name, item.color)}
      />
    );
  }

  return (
    <YStack flex={1} pt={12}>
      <FlashList
        data={data}
        renderItem={renderItem}
        estimatedItemSize={100}
        ListEmptyComponent={<Text textAlign="center">No tags</Text>}
      />
    </YStack>
  );
}

function NonFriendProfile({ user }: ProfileProps) {
  const userId = useAppSelector(selectUserId);
  const { data: pendingRequest } = useIsPendingRequest({
    userId,
    profileId: user.id,
  });

  const { mutateAsync: acceptFriendRequest } = useAcceptFriendRequest();

  async function acceptRequest(requestId: number) {
    await acceptFriendRequest(requestId, {
      onSuccess: () => {
        showToast({
          title: 'You just made a new friend',
          preset: 'done',
        });
      },
    });
  }

  const { mutate } = useSendFriendRequest();

  function sendRequest() {
    mutate(user.id, {
      onSuccess() {
        showToast({ title: 'Request sent', preset: 'done' });
      },
    });
  }

  return (
    <YStack jc="center" ai="center" flex={1}>
      {pendingRequest ? (
        <XStack gap={12}>
          <XStack
            px={12}
            py={4}
            borderRadius={4}
            borderWidth={0.5}
            pressStyle={{ bg: '$border500' }}
            bg="$success500"
            borderColor="$success600"
            onPress={() => acceptRequest(pendingRequest.id)}
          >
            <Check size={18} color="$white" />
          </XStack>
          <XStack
            bg="$error777"
            borderColor="$error600"
            px={12}
            py={4}
            borderRadius={4}
            borderWidth={0.5}
            pressStyle={{ bg: '$border500' }}
          >
            <X size={18} color="$error700" />
          </XStack>
        </XStack>
      ) : (
        <Button
          bg="$brandDark"
          fontWeight="bold"
          onPress={sendRequest}
        >{`Send Friend Request to ${user?.name}`}</Button>
      )}
    </YStack>
  );
}
