import { FlashList } from '@shopify/flash-list';
import { useForm } from 'react-hook-form';
import { RefreshControl } from 'react-native';
import { Spinner, YStack } from 'tamagui';

import { InputField } from 'components/InputField';
import { ListEmptyComponent } from 'components/ListEmptyComponent';
import type { FriendsTabScreenProps } from 'navigation.types';
import { UserRow } from 'social/components/UserRow';
import { type UsersView, useGetUsers } from 'social/queries/getUsers';

type Props = FriendsTabScreenProps<'Search'>;

export function SearchUsersView({ navigation }: Props) {
  const { data, isError, isFetching, isRefetching, refetch } = useGetUsers();
  const { control } = useForm<{ searchQuery: string }>({
    defaultValues: {
      searchQuery: '',
    },
  });

  function onUserPress(userId: string) {
    navigation.push('Profile', { userId });
  }

  function renderItem({ item }: { item: UsersView }) {
    return (
      <UserRow
        username={item.name}
        avatarUrl={item.avatar_url}
        onPress={() => onUserPress(item.id)}
        relation={item.relation}
        id={item.id}
        key={item.id}
      />
    );
  }

  return (
    <YStack fullscreen bg="$primary700">
      <InputField
        placeholder="Search for users"
        controlProps={{ control, name: 'searchQuery' }}
        stackProps={{ px: 8, pt: 12 }}
      />

      <FlashList
        data={data}
        renderItem={renderItem}
        estimatedItemSize={72}
        ListEmptyComponent={
          isFetching ? (
            <Spinner />
          ) : (
            <ListEmptyComponent
              isError={isError}
              isFiltered={false}
              defaultLabel="No users!"
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
        contentContainerStyle={{
          padding: 8,
        }}
      />
    </YStack>
  );
}
