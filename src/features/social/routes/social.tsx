import { FlashList } from '@shopify/flash-list';
import { ArrowRight, Check, Search, X } from '@tamagui/lucide-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import { RefreshControl, StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';
import { Spinner, View, XStack, YStack } from 'tamagui';

import type { Tables } from 'lib/supabase/database.interface';
import type { FriendsTabScreenProps } from 'navigation.types';
import { showToast } from 'util/toast';

import { ListEmptyComponent } from 'components/ListEmptyComponent';
import { PagerChips } from '../components/PagerChips';
import { UserRow } from '../components/UserRow';
import { useAcceptFriendRequest } from '../queries/acceptFriendRequest';
import {
  type RecievedFriendRequest,
  useGetFriendRequests,
} from '../queries/getFriendRequests';
import { useGetFriends } from '../queries/getFriends';
import { useGetPendingFriendRequests } from '../queries/getPendingRequests';

const pagerScreens = ['friends', 'requests', 'sent'] as const;

type Props = FriendsTabScreenProps<'Friends'>;

export function Social({ navigation }: Props) {
  const [activePageIndex, setActivePageIndex] = useState(0);
  const pagerRef = useRef<PagerView>(null);

  const setPage = useCallback(
    (page: number) => pagerRef.current?.setPage(page),
    [],
  );

  function onPressUserRow(userId: string) {
    navigation.push('Profile', { userId });
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return <Search onPress={() => navigation.push('Search')} />;
      },
    });
  }, [navigation]);

  return (
    <YStack fullscreen bg="$primary700">
      <PagerChips
        pages={pagerScreens}
        activePageIndex={activePageIndex}
        setPage={setPage}
        m={12}
        gap={8}
      />

      <PagerView
        initialPage={activePageIndex}
        style={{ flex: 1 }}
        ref={pagerRef}
        onPageSelected={(e) => setActivePageIndex(e.nativeEvent.position)}
        scrollEnabled={false}
      >
        <FriendsPage onRowPress={onPressUserRow} />
        <FriendRequestPage onRowPress={onPressUserRow} />
        <SentRequestsPage onRowPress={onPressUserRow} />
      </PagerView>
    </YStack>
  );
}

interface CommonPageProps {
  onRowPress(userId: string): void;
}

function FriendsPage(props: CommonPageProps) {
  const { data, isError, isFetching, isRefetching, refetch } = useGetFriends();

  const renderFriend = ({ item }: { item: Tables<'profiles'> }) => (
    <UserRow
      username={item.name}
      avatarUrl={undefined}
      iconAfter={<ArrowRight />}
      onPress={() => props.onRowPress(item.id)}
      my={4}
    />
  );

  return (
    <View key={pagerScreens[0]} w="$full" h="$full">
      <FlashList
        data={data}
        renderItem={renderFriend}
        estimatedItemSize={72}
        contentContainerStyle={styles.lists}
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

function FriendRequestPage(props: CommonPageProps) {
  const { data, isRefetching, refetch, isError, isFetching } =
    useGetFriendRequests();
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

  const renderFriendRequest = ({ item }: { item: RecievedFriendRequest }) => (
    <UserRow
      username={item.sender_profile?.name ?? 'NA'}
      avatarUrl={undefined}
      onPress={() => props.onRowPress(item.sender_profile.id)}
      iconAfter={
        <XStack gap={8}>
          <XStack
            px={12}
            py={4}
            borderRadius={4}
            borderWidth={0.5}
            pressStyle={{ bg: '$border500' }}
            bg="$success500"
            borderColor="$success600"
            onPress={() => acceptRequest(item.id)}
          >
            <Check size={18} color="$success600" />
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
      }
      my={4}
    />
  );

  return (
    <View key={pagerScreens[1]} w="$full" h="$full">
      <FlashList
        data={data}
        renderItem={renderFriendRequest}
        estimatedItemSize={100}
        contentContainerStyle={styles.lists}
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

function SentRequestsPage(props: CommonPageProps) {
  const { data, isRefetching, refetch, isError, isFetching } =
    useGetPendingFriendRequests();

  function renderSentRequest({ item }: { item: Tables<'profiles'> }) {
    return (
      <UserRow username={item.name} onPress={() => props.onRowPress(item.id)} />
    );
  }

  return (
    <View key={pagerScreens[2]} h="$full" w="$full">
      <FlashList
        data={data ?? []}
        renderItem={renderSentRequest}
        estimatedItemSize={72}
        contentContainerStyle={styles.lists}
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

const styles = StyleSheet.create({
  lists: {
    paddingHorizontal: 8,
  },
});
