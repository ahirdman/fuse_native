import { FlashList } from '@shopify/flash-list';
import { Search } from '@tamagui/lucide-icons';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { RefreshControl, StyleSheet } from 'react-native';
import { Paragraph, Spinner, XStack, YStack } from 'tamagui';

import { useDebounce } from 'hooks/useDebounce';
import { Tables } from 'lib/supabase/database-generated.types';
import type { TagListScreenProps } from 'navigation.types';

import { InputField } from 'components/InputField';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TagRow } from 'tag/components/TagRow';
import { useGetTags } from 'tag/queries/getTags';

interface FilterTagsArgs {
  tags: Tables<'tags'>[];
  filter: string;
}

export function TagList({ navigation }: TagListScreenProps<'TagList'>) {
  const { data, refetch, isFetching, isLoading } = useGetTags();
  const insets = useSafeAreaInsets();

  const isRefreshing = isFetching && !isLoading;

  const { control, watch } = useForm({
    defaultValues: {
      tagFilter: '',
    },
  });

  const formValue = watch();
  const debouncedTrackFilter = useDebounce(formValue.tagFilter, 300);

  function handleRefetch() {
    void refetch();
  }

  function handleTagRowPress(tag: Tables<'tags'>) {
    navigation.navigate('Tag', {
      id: tag.id,
      name: tag.name,
      color: tag.color,
    });
  }

  const filterTags = useCallback(
    ({ tags, filter }: FilterTagsArgs): Tables<'tags'>[] => {
      const fieldsToMatch = ['name'] as const;

      const res = tags.filter((tag) =>
        fieldsToMatch.some((field) =>
          tag[field]?.toLowerCase().includes(filter),
        ),
      );

      return res;
    },
    [],
  );

  const tags: Tables<'tags'>[] = useMemo(() => {
    return !debouncedTrackFilter.length
      ? data ?? []
      : filterTags({
          tags: data ?? [],
          filter: debouncedTrackFilter.toLowerCase(),
        });
  }, [data, debouncedTrackFilter, filterTags]);

  const keyExtractor = (item: Tables<'tags'>) => item.id.toString();

  const renderItem = ({ item }: { item: Tables<'tags'> }) => {
    return (
      <TagRow
        tagName={item.name}
        tagColor={item.color}
        onPress={() => handleTagRowPress(item)}
      />
    );
  };

  const ItemSeparatorComponent = () => <XStack h={8} />;

  function ListEmpytComponent() {
    return <Paragraph textAlign="center">No tags created</Paragraph>;
  }

  return (
    <YStack flex={1} bg="$primary700">
      <XStack
        bg="$primary300"
        p={8}
        paddingTop={insets.top}
        borderBottomColor="$border400"
        borderWidth={0.5}
      >
        <InputField
          placeholder="Search for tags"
          w="full"
          size="md"
          rounded="6"
          autoCorrect={false}
          autoCapitalize="none"
          InputLeftElement={<Search size={18} ml={12} color="$primary400" />}
          controlProps={{ control, name: 'tagFilter' }}
        />
      </XStack>

      {isLoading && (
        <YStack fullscreen justifyContent="center" alignItems="center">
          <Spinner />
        </YStack>
      )}

      <FlashList
        data={tags}
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
            tintColor="#F07123"
          />
        }
      />
    </YStack>
  );
}

const styles = StyleSheet.create({
  flashList: {
    padding: 8,
  },
});
