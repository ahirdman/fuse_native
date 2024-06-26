import { FlashList } from '@shopify/flash-list';
import { Check, Tags, X } from '@tamagui/lucide-icons';
import { Button, H2, Separator, XStack, YStack } from 'tamagui';

import type { Tables } from 'lib/supabase/database.interface';
import type { FriendsTabScreenProps } from 'navigation.types';

import { selectUserId } from 'auth/auth.slice';
import { Alert } from 'components/Alert';
import { Text } from 'components/Text';
import { UserAvatar } from 'components/UserAvatar';
import { useGetUserWithRelation } from 'features/social/queries/getUser';
import { useAcceptFriendRequest } from 'social/queries/acceptFriendRequest';
import { useIsPendingRequest } from 'social/queries/getFriendRequests';
import type { UsersView } from 'social/queries/getUsers';
import { useSendFriendRequest } from 'social/queries/sendFriendRequest';
import { useAppSelector } from 'store/hooks';
import { TagRow } from 'tag/components/TagRow';
import { useGetTags } from 'tag/queries/getTags';
import { showToast } from 'util/toast';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { FriendProfileMenu } from 'social/components/profile.menu';
import { useRemoveFriend } from 'social/queries/removeFriend';

type Props = FriendsTabScreenProps<'Profile'>;

export function Profile({ route, navigation }: Props) {
  const { data: user } = useGetUserWithRelation(route.params.userId);

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
    <YStack fullscreen bg="$primary700" justifyContent="space-between">
      <XStack
        gap={16}
        px={24}
        justifyContent="space-between"
        position="relative"
        bg="$brandDark"
      >
        <YStack justifyContent="flex-end" zIndex={100} pb={24}>
          <H2 fontWeight="bold" verticalAlign="bottom">
            {user.name}
          </H2>
        </YStack>
        <YStack
          position="absolute"
          bg="$primary700"
          h="50%"
          w="120%"
          bottom={0}
        />

        <UserAvatar
          imageUrl={user.avatar_url ?? undefined}
          size="xl"
          borderColor="$primary700"
          borderWidth={6}
        />
      </XStack>

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
  const navigation = useNavigation()
  const { mutate } = useRemoveFriend()

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <FriendProfileMenu
          onDeletePress={() => mutate(user.id, { onSuccess: () => navigation.goBack() })
          }
        />
      ),
    });
  }, [navigation]);

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
    <YStack flex={1} pt={24} px={12} gap={24}>
      <XStack
        bg="$primary800"
        borderRadius={8}
        h={56}
        p={8}
        ai="center"
        jc="space-evenly"
      >
        <XStack gap={8}>
          <Tags />
          <Text>{data?.length} tags</Text>
        </XStack>
      </XStack>

      <FlashList
        data={data}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <Separator h={8} />}
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
    <YStack flex={1} pt={24} px={12} gap={24}>
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
