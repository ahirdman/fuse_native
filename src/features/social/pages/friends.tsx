import { FlashList } from '@shopify/flash-list';
import { RefreshControl } from 'react-native';
import { Separator, Spinner, View } from 'tamagui';

import type { Tables } from 'lib/supabase/database.interface';

import { selectUserId } from 'auth/auth.slice';
import { ListEmptyComponent } from 'components/ListEmptyComponent';
import { UserRow } from 'social/components/UserRow';
import { useGetFriends } from 'social/queries/getFriends';
import type { CommonPageProps } from 'social/routes/social';
import { useAppSelector } from 'store/hooks';

export function FriendsPage(props: CommonPageProps) {
  const userId = useAppSelector(selectUserId);
  const { data, isError, isFetching, isRefetching, refetch } =
    useGetFriends(userId);

  const renderFriend = ({ item }: { item: Tables<'profiles'> }) => (
    <UserRow
      id={item.id}
      username={item.name}
      avatarUrl={item.avatar_url}
      relation="friend"
      onPress={() => props.onRowPress(item.id)}
    />
  );

  return (
    <View key="friends" w="$full" h="$full">
      <FlashList
        data={data}
        renderItem={renderFriend}
        ItemSeparatorComponent={() => <Separator h={8} />}
        estimatedItemSize={72}
        contentContainerStyle={{
          paddingHorizontal: 8,
        }}
        ListEmptyComponent={
          isFetching ? (
            <Spinner />
          ) : (
            <ListEmptyComponent
              isError={isError}
              isFiltered={false}
              defaultLabel="You have no friends"
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
