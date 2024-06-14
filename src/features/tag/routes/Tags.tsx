import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { FlashList } from '@shopify/flash-list';
import { Plus } from '@tamagui/lucide-icons';
import { useCallback, useRef, useState } from 'react';
import { RefreshControl, StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';
import { type ColorTokens, Paragraph, Text, XStack, YStack } from 'tamagui';

import type { Tables } from 'lib/supabase/database-generated.types';
import type { TagTabScreenProps } from 'navigation.types';
import { useAppSelector } from 'store/hooks';

import { selectUserId } from 'auth/auth.slice';
import { DetachedModal } from 'components/DetachedModal';
import {
  type FuseTagWithSubTags,
  useGetFuseLists,
} from 'fuse/queries/getFuseLists';
import { usePager } from 'hooks/usePager';
import { PagerChips } from 'social/components/PagerChips';
import { StyledTagRow, TagRow } from 'tag/components/TagRow';
import { TagForm } from 'tag/components/Tagform';
import { useCreateTag } from 'tag/queries/createTag';
import { useGetTags } from 'tag/queries/getTags';
import { hapticFeedback } from 'util/haptic';

const pagerScreens = ['tags', 'fuse tags'];

export function TagListView({ navigation }: TagTabScreenProps<'TagList'>) {
  const [activePageIndex, setActivePageIndex] = useState(0);
  const { ref, setPage } = usePager();

  function handleTagRowPress(tag: Tables<'tags'>) {
    navigation.navigate('Tag', { ...tag, type: 'tag' });
  }

  function handleFuseRowPress({ id, name, tags }: FuseTagWithSubTags) {
    navigation.navigate('Tag', {
      id,
      name,
      type: 'fuse',
      tagIds: tags.map((tag) => tag.id),
    });
  }

  return (
    <YStack fullscreen bg="$primary700" px={12} pt={8} gap={12}>
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
      ListFooterComponent={<TagListFooter />}
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

function TagListFooter() {
  const { mutate: createTag } = useCreateTag();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const onRowPress = useCallback(() => {
    hapticFeedback('Medium');
    bottomSheetRef.current?.present();
  }, []);

  const color: ColorTokens = '$lightText';

  return (
    <>
      <StyledTagRow mt={8} onPress={onRowPress}>
        <XStack ai="center" gap={8}>
          <Plus color={color} size={20} />
          <Text color={color}>Create new tag</Text>
        </XStack>
      </StyledTagRow>

      <DetachedModal ref={bottomSheetRef}>
        <TagForm
          label="Create New Tag"
          closeAction={() => bottomSheetRef.current?.close()}
          confirmAction={({ name, color }) =>
            createTag(
              { name, color },
              {
                onSuccess: () => {
                  bottomSheetRef.current?.close();
                },
              },
            )
          }
        />
      </DetachedModal>
    </>
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

  const keyExtractor = (item: FuseTagWithSubTags) => item.id.toString();

  const renderItem = ({ item }: { item: FuseTagWithSubTags }) => {
    return (
      <TagRow
        name={item.name}
        color={item.tags.map((tag) => tag.color)}
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
