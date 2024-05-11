import { FlashList } from '@shopify/flash-list';
import { useCallback, useRef, useState } from 'react';
import { Animated, RefreshControl, StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';
import { H6, Paragraph, XStack, YStack } from 'tamagui';

import type { Tables } from 'lib/supabase/database-generated.types';
import type { TagTabScreenProps } from 'navigation.types';
import { useAppSelector } from 'store/hooks';

import { selectUserId } from 'auth/auth.slice';
import { SectionButton } from 'components/SectionButton';
import { type FuseTagRowRes, useGetFuseLists } from 'fuse/queries/getFuseLists';
import { CreateTagSheet } from 'tag/components/CreateTag.sheet';
import { TagRow } from 'tag/components/TagRow';
import { useGetTags } from 'tag/queries/getTags';

const AnimatedPager = Animated.createAnimatedComponent(PagerView);

export function TagListView({ navigation }: TagTabScreenProps<'TagList'>) {
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [createTagSheetOpen, setCreateTagSheetOpen] = useState(false);

  const pagerRef = useRef<PagerView>(null);

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

  const setPage = useCallback(
    (page: number) => pagerRef.current?.setPage(page),
    [],
  );

  return (
    <YStack fullscreen bg="$primary700" px={12} pt={8} gap={12}>
      <XStack justifyContent="space-between" bg="$colorTransparent">
        <SectionButton title="Create Tag" onPress={handleCreateTag} />
        <SectionButton title="Create Fuse" onPress={handleCreateFuse} />
      </XStack>

      <YStack
        flex={1}
        bg="$primary800"
        borderTopLeftRadius={12}
        borderTopRightRadius={12}
      >
        <XStack p={12} mb={3}>
          <H6
            fontSize="$4"
            textTransform="uppercase"
            color={activePageIndex === 0 ? 'white' : '$border300'}
            textAlign="center"
            flex={1}
            onPress={() => setPage(0)}
            pressStyle={{
              color: '$brandDark',
            }}
          >
            Tags
          </H6>

          <H6
            fontSize="$4"
            flex={1}
            textTransform="uppercase"
            color={activePageIndex === 1 ? 'white' : '$border300'}
            textAlign="center"
            onPress={() => setPage(1)}
            pressStyle={{
              color: '$brandDark',
            }}
          >
            Fuse Lists
          </H6>
        </XStack>

        <AnimatedPager
          initialPage={0}
          style={{ flex: 1 }}
          ref={pagerRef}
          onPageSelected={(e) => setActivePageIndex(e.nativeEvent.position)}
        >
          <YStack key="tag-lists" width="100%" height="100%" minHeight={40}>
            <TagList onRowPress={handleTagRowPress} />
          </YStack>

          <YStack key="fuse-lists" width="100%" height="100%">
            <FuseList onRowPress={handleFuseRowPress} />
          </YStack>
        </AnimatedPager>
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
    return <Paragraph textAlign="center">No fuse lists created</Paragraph>;
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
