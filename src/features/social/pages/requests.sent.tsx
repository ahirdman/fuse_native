import { FlashList } from '@shopify/flash-list';
import { selectUserId } from 'auth/auth.slice';
import { ListEmptyComponent } from 'components/ListEmptyComponent';
import type { Tables } from 'lib/supabase/database.interface';
import { RefreshControl } from 'react-native';
import { UserRow } from 'social/components/UserRow';
import { useGetPendingFriendRequests } from 'social/queries/getPendingRequests';
import type { CommonPageProps } from 'social/routes/social';
import { useAppSelector } from 'store/hooks';
import { Separator, Spinner, View } from 'tamagui';

export function SentRequestsPage(props: CommonPageProps) {
  const userId = useAppSelector(selectUserId);
  const { data, isRefetching, refetch, isError, isFetching } =
    useGetPendingFriendRequests(userId);

  function renderSentRequest({ item }: { item: Tables<'profiles'> }) {
    return (
      <UserRow
        id={item.id}
        username={item.name}
        onPress={() => props.onRowPress(item.id)}
        relation="requested_to"
        avatarUrl={item.avatar_url}
      />
    );
  }

  return (
    <View key="sent" h="$full" w="$full">
      <FlashList
        data={data ?? []}
        renderItem={renderSentRequest}
        estimatedItemSize={72}
        ItemSeparatorComponent={() => <Separator h={8} />}
        contentContainerStyle={{ paddingHorizontal: 8 }}
        ListEmptyComponent={
          isFetching ? (
            <Spinner />
          ) : (
            <ListEmptyComponent
              isError={isError}
              isFiltered={false}
              defaultLabel="No requests sent"
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
