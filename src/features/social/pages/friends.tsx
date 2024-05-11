import { FlashList } from '@shopify/flash-list';
import { RefreshControl } from 'react-native';
import { Spinner, View } from 'tamagui';

import type { Tables } from 'lib/supabase/database.interface';

import { ListEmptyComponent } from 'components/ListEmptyComponent';
import { UserRow } from 'social/components/UserRow';
import { useGetFriends } from 'social/queries/getFriends';
import type { CommonPageProps } from 'social/routes/social';

export function FriendsPage(props: CommonPageProps) {
  const { data, isError, isFetching, isRefetching, refetch } = useGetFriends();

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
