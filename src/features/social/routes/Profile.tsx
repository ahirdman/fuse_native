import { FlashList } from '@shopify/flash-list';
import { Tags } from '@tamagui/lucide-icons';
import { useEffect } from 'react';
import { Button, H2, H3, H4, H5, Separator, XStack, YStack } from 'tamagui';

import type { Tables } from 'lib/supabase/database.interface';
import type { FriendsTabScreenProps } from 'navigation.types';
import { showToast } from 'util/toast';

import { useNavigation } from '@react-navigation/native';
import { selectUserId } from 'auth/auth.slice';
import { Alert } from 'components/Alert';
import { Text } from 'components/Text';
import { UserAvatar } from 'components/UserAvatar';
import { useGetUserWithRelation } from 'features/social/queries/getUser';
import { FriendProfileMenu } from 'social/components/profile.menu';
import { useAcceptFriendRequest } from 'social/queries/acceptFriendRequest';
import {
  useGetProfileRelationStatus,
  useIsPendingRequest,
} from 'social/queries/getFriendRequests';
import type { UsersView } from 'social/queries/getUsers';
import { useRemoveFriend } from 'social/queries/removeFriend';
import { useSendFriendRequest } from 'social/queries/sendFriendRequest';
import { useAppSelector } from 'store/hooks';
import { TagRow } from 'tag/components/TagRow';
import { useGetTags } from 'tag/queries/getTags';

type Props = FriendsTabScreenProps<'Profile'>;

export function Profile({ route, navigation }: Props) {
  const { data: user } = useGetUserWithRelation(route.params.userId);

  const isFriend = user?.relation === 'friend';

  function onTagPress(id: number, name: string, color: string) {
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
        <FriendProfile user={user} onTagPress={onTagPress} />
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
  const navigation = useNavigation();
  const { mutate } = useRemoveFriend();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <FriendProfileMenu
          onDeletePress={() =>
            mutate(user.id, { onSuccess: () => navigation.goBack() })
          }
        />
      ),
    });
  }, [navigation, user.id, mutate]);

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

  const { data: profile } = useGetProfileRelationStatus({
    profileUserId: user.id,
  });
  const { mutateAsync: acceptFriendRequest } = useAcceptFriendRequest();
  const { mutate: sendFriendRequest } = useSendFriendRequest();

  const { data: pendingRequest } = useIsPendingRequest({
    userId,
    profileId: user.id,
  });

  function renderProfileAction() {
    switch (profile?.relation) {
      case 'requested_by': {
        async function handleRequest(status: 'accepted' | 'rejected') {
          if (!pendingRequest) return;

          await acceptFriendRequest(
            { requestId: pendingRequest.id, status },
            {
              onSuccess: () => {
                if (status === 'accepted') {
                  showToast({
                    title: 'You just made a new friend',
                    preset: 'done',
                  });
                }
              },
            },
          );
        }

        return (
          <YStack gap={8} pb={8}>
            <H5>{`${user.name} wants to be your friend`}</H5>
            <XStack gap={8} jc="center">
              <Button
                onPress={() => handleRequest('accepted')}
                bg="$brandDark"
                fontWeight="bold"
              >
                Accept
              </Button>
              <Button onPress={() => handleRequest('rejected')}>Decline</Button>
            </XStack>
          </YStack>
        );
      }
      case 'requested_to': {
        return <Text>Waiting For Response</Text>;
      }
      case 'none': {
        function sendRequest() {
          sendFriendRequest(user.id, {
            onSuccess() {
              showToast({ title: 'Request sent', preset: 'done' });
            },
          });
        }

        return (
          <Button onPress={sendRequest} bg="$brandDark" fontWeight="bold" m={8}>
            Send Friend Request
          </Button>
        );
      }
      default:
        return null;
    }
  }

  return (
    <YStack flex={1} pt={24} px={12} gap={24}>
      <XStack
        bg="$primary800"
        borderRadius={8}
        p={8}
        ai="center"
        jc="space-evenly"
      >
        {renderProfileAction()}
      </XStack>
    </YStack>
  );
}
