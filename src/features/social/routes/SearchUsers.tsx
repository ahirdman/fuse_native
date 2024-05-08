import { FlashList } from '@shopify/flash-list';
import { UserPlus } from '@tamagui/lucide-icons';
import { useForm } from 'react-hook-form';
import { RefreshControl } from 'react-native';
import { Spinner, XStack, YStack } from 'tamagui';

import type { Tables } from 'lib/supabase/database.interface';
import { showToast } from 'util/toast';

import { InputField } from 'components/InputField';
import { ListEmptyComponent } from 'components/ListEmptyComponent';
import { UserRow } from 'social/components/UserRow';
import { useGetUsers } from 'social/queries/getUsers';
import { useSendFriendRequest } from 'social/queries/sendFriendRequest';

export function SearchUsersView() {
  const { data, isError, isFetching, isRefetching, refetch } = useGetUsers();
  const { control } = useForm<{ searchQuery: string }>({
    defaultValues: {
      searchQuery: '',
    },
  });

  const { mutate } = useSendFriendRequest();

  function sendFriendRequest(uid: string) {
    mutate(uid, {
      onSuccess() {
        showToast({
          title: 'Friend Request sent!',
          preset: 'done',
        });
      },
    });
  }

  function renderItem({ item }: { item: Tables<'profiles'> }) {
    return (
      <UserRow
        username={item.name}
        avatarUrl={item.avatar_url ?? undefined}
        iconAfter={
          <XStack
            bg="$primary700"
            px={12}
            py={4}
            borderRadius={4}
            borderColor="$border500"
            borderWidth={0.5}
            pressStyle={{ bg: '$border500' }}
            onPress={() => sendFriendRequest(item.id)}
          >
            <UserPlus size={18} />
          </XStack>
        }
        my={4}
      />
    );
  }

  return (
    <YStack fullscreen bg="$primary700">
      <InputField controlProps={{ control, name: 'searchQuery' }} m={8} />
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
