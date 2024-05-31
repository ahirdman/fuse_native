import { FlashList } from '@shopify/flash-list';
import { useState } from 'react';
import { RefreshControl, StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';
import { Paragraph, XStack, YStack } from 'tamagui';

import type { Tables } from 'lib/supabase/database-generated.types';
import type { TagTabScreenProps } from 'navigation.types';
import { useAppSelector } from 'store/hooks';

import { selectUserId } from 'auth/auth.slice';
import { SectionButton } from 'components/SectionButton';
import { type FuseTagRowRes, useGetFuseLists } from 'fuse/queries/getFuseLists';
import { usePager } from 'hooks/usePager';
import { PagerChips } from 'social/components/PagerChips';
import { CreateTagSheet } from 'tag/components/CreateTag.sheet';
import { TagRow } from 'tag/components/TagRow';
import { useGetTags } from 'tag/queries/getTags';

const pagerScreens = ['tags', 'fuse tags'];

export function TagListView({ navigation }: TagTabScreenProps<'TagList'>) {
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [createTagSheetOpen, setCreateTagSheetOpen] = useState(false);
  const { ref, setPage } = usePager();

  function handleCreateFuse() {
    navigation.navigate('AddFuseTag');
  }

  function handleCreateTag() {
    setCreateTagSheetOpen(true);
  }

  function handleTagRowPress(tag: Tables<'tags'>) {
    navigation.navigate('Tag', { ...tag });
  }

  function handleFuseRowPress({ id, name }: { id: number; name: string }) {
    navigation.navigate('FuseList', { id, name });
  }

  return (
    <YStack fullscreen bg="$primary700" px={12} pt={8} gap={12}>
      <XStack justifyContent="space-between" bg="$colorTransparent">
        <SectionButton title="Create Tag" onPress={handleCreateTag} />
        <SectionButton title="Create Fuse" onPress={handleCreateFuse} />
      </XStack>

      <YStack flex={1}>
        <PagerChips
          pages={pagerScreens}
          activePageIndex={activePageIndex}
          setPage={setPage}
          mb={12}
          mx={52}
        />

        <PagerView
          initialPage={0}
          style={{ flex: 1 }}
          ref={ref}
          onPageSelected={(e) => setActivePageIndex(e.nativeEvent.position)}
        >
          <YStack key="tag-lists" width="100%" height="100%" minHeight={40}>
            <TagList onRowPress={handleTagRowPress} />
          </YStack>

          <YStack key="fuse-lists" width="100%" height="100%">
            <FuseList onRowPress={handleFuseRowPress} />
          </YStack>
        </PagerView>
      </YStack>

      <CreateTagSheet
        modal
        isOpen={createTagSheetOpen}
        closeSheet={() => setCreateTagSheetOpen(false)}
      />
    </YStack>
  );
}

interface TagListProps {
  onRowPress(item: Tables<'tags'>): void;
}

function TagList({ onRowPress }: TagListProps) {
  const userId = useAppSelector(selectUserId);
  const { data, refetch, isFetching, isLoading } = useGetTags(userId);
  const isRefreshing = isFetching && !isLoading;

  function handleRefetch() {
    void refetch();
  }

  const keyExtractor = (item: Tables<'tags'>) => item.id.toString();

  const renderItem = ({ item }: { item: Tables<'tags'> }) => {
    return (
      <TagRow
        name={item.name}
        color={item.color}
        onPress={() => onRowPress(item)}
      />
    );
  };

  const ItemSeparatorComponent = () => <XStack h={8} />;

  function ListEmpytComponent() {
    return <Paragraph textAlign="center">No tags created</Paragraph>;
  }

  return (
    <FlashList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListEmptyComponent={ListEmpytComponent}
      estimatedItemSize={40}
      ItemSeparatorComponent={ItemSeparatorComponent}
      contentContainerStyle={styles.flashList}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefetch}
          tintColor="#F4753F"
        />
      }
    />
  );
}

interface FuseListProps {
  onRowPress({ id, name }: { id: number; name: string }): void;
}

function FuseList({ onRowPress }: FuseListProps) {
  const { data, refetch, isFetching, isLoading } = useGetFuseLists();
  const isRefreshing = isFetching && !isLoading;

  function handleRefetch() {
    void refetch();
  }

  const keyExtractor = (item: FuseTagRowRes) => item.id.toString();

  const renderItem = ({ item }: { item: FuseTagRowRes }) => {
    return (
      <TagRow
        name={item.name}
        color={item.tag1.color}
        onPress={() => onRowPress({ ...item })}
      />
    );
  };

  const ItemSeparatorComponent = () => <XStack h={8} />;

  function ListEmpytComponent() {
    return <Paragraph textAlign="center">No fuse tags created.</Paragraph>;
  }

  return (
    <FlashList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListEmptyComponent={ListEmpytComponent}
      estimatedItemSize={40}
      ItemSeparatorComponent={ItemSeparatorComponent}
      contentContainerStyle={styles.flashList}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefetch}
          tintColor="#F4753F"
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  flashList: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
});
