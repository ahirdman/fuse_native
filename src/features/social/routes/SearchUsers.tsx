import { FlashList } from '@shopify/flash-list';
import { Search, UserSearch } from '@tamagui/lucide-icons';
import { useForm } from 'react-hook-form';
import { RefreshControl } from 'react-native';
import { Spinner, View, YStack } from 'tamagui';

import { useDebounce } from 'hooks/useDebounce';
import type { FriendsTabScreenProps } from 'navigation.types';

import { Alert } from 'components/Alert';
import { InputField } from 'components/InputField';
import { Text } from 'components/Text';
import { UserRow } from 'social/components/UserRow';
import { type UsersView, useGetUsers } from 'social/queries/getUsers';

type Props = FriendsTabScreenProps<'Search'>;
export function SearchUsersView({ navigation }: Props) {
  const { control, watch } = useForm<{ searchQuery: string }>({
    defaultValues: {
      searchQuery: '',
    },
  });

  const searchQuery = watch('searchQuery');
  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 300);

  const { data, isError, isFetching, isRefetching, refetch } = useGetUsers({
    searchQuery: debouncedSearchQuery,
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
        iconLeft={<Search color="$border300" size={18} />}
        pl={8}
      />

      <FlashList
        data={data}
        renderItem={renderItem}
        estimatedItemSize={72}
        ItemSeparatorComponent={() => <View h={12} />}
        ListEmptyComponent={
          <SearchUsersListEmptyComponent
            searchQuery={debouncedSearchQuery}
            isError={isError}
            isFetching={isFetching}
          />
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

interface SearchUsersListEmptyArgs {
  searchQuery: string;
  isFetching: boolean;
  isError: boolean;
}

function SearchUsersListEmptyComponent({
  isFetching,
  isError,
  searchQuery,
}: SearchUsersListEmptyArgs) {
  if (isFetching) {
    return <Spinner />;
  }

  if (isError) {
    return <Alert label="Could not get users" type="error" />;
  }

  const searchInfo = searchQuery.length
    ? `No Results for "${searchQuery}"`
    : 'Search for Users';

  return (
    <View flex={1} h="$full" jc="center" ai="center" pt="50%" gap={12}>
      <UserSearch size={58} color="$border300" />
      <Text fontSize="$8" fontWeight="bold" color="$border300">
        {searchInfo}
      </Text>
    </View>
  );
}
