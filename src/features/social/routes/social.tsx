import { Search } from '@tamagui/lucide-icons';
import { useEffect, useState } from 'react';
import PagerView from 'react-native-pager-view';
import { YStack } from 'tamagui';

import type { FriendsTabScreenProps } from 'navigation.types';

import { usePager } from 'hooks/usePager';
import { PagerChips } from 'social/components/PagerChips';
import { FriendsPage } from 'social/pages/friends';
import { FriendRequestPage } from 'social/pages/requests.recived';
import { SentRequestsPage } from 'social/pages/requests.sent';

const pagerScreens = ['friends', 'requests', 'sent'] as const;
export interface CommonPageProps {
  onRowPress(userId: string): void;
}

type Props = FriendsTabScreenProps<'Friends'>;

export function Social({ navigation }: Props) {
  const { setPage, ref } = usePager();
  const [activePageIndex, setActivePageIndex] = useState(0);

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
        ref={ref}
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
