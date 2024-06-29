import { FlashList } from '@shopify/flash-list';
import { Check, X } from '@tamagui/lucide-icons';
import { selectUserId } from 'auth/auth.slice';
import { ListEmptyComponent } from 'components/ListEmptyComponent';
import { RefreshControl } from 'react-native';
import { UserRow } from 'social/components/UserRow';
import {
  type FriendRequestResponseArgs,
  useAcceptFriendRequest,
} from 'social/queries/acceptFriendRequest';
import {
  type RecievedFriendRequest,
  useGetFriendRequests,
} from 'social/queries/getFriendRequests';
import type { CommonPageProps } from 'social/routes/social';
import { useAppSelector } from 'store/hooks';
import { Spinner, View, XStack } from 'tamagui';
import { showToast } from 'util/toast';

export function FriendRequestPage(props: CommonPageProps) {
  const userId = useAppSelector(selectUserId);
  const { data, isRefetching, refetch, isError, isFetching } =
    useGetFriendRequests(userId);
  const { mutateAsync: acceptFriendRequest } = useAcceptFriendRequest();

  async function respondeToRequest(args: FriendRequestResponseArgs) {
    await acceptFriendRequest(args, {
      onSuccess: () => {
        if (args.status === 'accepted') {
          showToast({
            title: 'You just made a new friend',
            preset: 'done',
          });
        }
      },
    });
  }

  const renderFriendRequest = ({ item }: { item: RecievedFriendRequest }) => (
    <UserRow
      id={item.sender_profile.id}
      relation="requested_by"
      username={item.sender_profile?.name ?? 'NA'}
      avatarUrl={item.sender_profile.avatar_url}
      onPress={() => props.onRowPress(item.sender_profile.id)}
      renderRight={() => (
        <XStack gap={12} mr={4}>
          <XStack
            px={8}
            py={8}
            borderRadius={4}
            borderWidth={0.5}
            pressStyle={{ bg: '$border500' }}
            bg="$success500"
            borderColor="$success600"
            onPress={() =>
              respondeToRequest({ requestId: item.id, status: 'accepted' })
            }
          >
            <Check size={22} color="$white" />
          </XStack>
          <XStack
            bg="$error777"
            borderColor="$error600"
            px={8}
            py={8}
            borderRadius={4}
            borderWidth={0.5}
            pressStyle={{ bg: '$border500' }}
            onPress={() =>
              respondeToRequest({ requestId: item.id, status: 'rejected' })
            }
          >
            <X size={22} color="$error700" />
          </XStack>
        </XStack>
      )}
    />
  );

  return (
    <View key="requests" w="$full" h="$full">
      <FlashList
        data={data}
        renderItem={renderFriendRequest}
        estimatedItemSize={100}
        contentContainerStyle={{ paddingHorizontal: 8 }}
        ListEmptyComponent={
          isFetching ? (
            <Spinner />
          ) : (
            <ListEmptyComponent
              isError={isError}
              isFiltered={false}
              defaultLabel="No requests recived"
              size="small"
            />
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#F4753F"
          />
        }
      />
    </View>
  );
}
