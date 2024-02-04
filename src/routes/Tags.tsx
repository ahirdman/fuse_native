import { Box, Icon } from 'native-base';

import InputField from '@/components/atoms/InputField';
import TagRow from '@/components/molecules/TagRow';
import useDebounce from '@/hooks/useDebounce';
import { TagListScreenProps } from '@/navigation.types';
import { useGetAllTagsQuery } from '@/services/supabase/tags/tags.endpoints';
import { TagsWithTrackIdsQuery } from '@/services/supabase/tags/tags.interface';
import { Feather } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { RefreshControl, StyleSheet } from 'react-native';

interface FilterTagsArgs {
  tags: TagsWithTrackIdsQuery[];
  filter: string;
}

export default function TagList({ navigation }: TagListScreenProps<'TagList'>) {
  const { data, refetch, isFetching } = useGetAllTagsQuery({});
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

  function handleTagRowPress(tag: TagsWithTrackIdsQuery) {
    navigation.navigate('Tag', { id: tag.id, name: tag.name });
  }

  const filterTags = useCallback(
    ({ tags, filter }: FilterTagsArgs): TagsWithTrackIdsQuery[] => {
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

  const tags: TagsWithTrackIdsQuery[] = useMemo(() => {
    return !debouncedTrackFilter.length
      ? data ?? []
      : filterTags({
          tags: data ?? [],
          filter: debouncedTrackFilter.toLowerCase(),
        });
  }, [data, debouncedTrackFilter, filterTags]);

  const keyExtractor = (item: TagsWithTrackIdsQuery) => item.id.toString();

  const renderItem = ({ item }: { item: TagsWithTrackIdsQuery }) => {
    return (
      <TagRow
        tagName={item.name}
        tagColor={item.color}
        onPress={() => handleTagRowPress(item)}
      />
    );
  };

  const ItemSeparatorComponent = () => <Box h="2" />;

  return (
    <Box flex={1} background="primary.700">
      <Box
        w="full"
        justifyContent="space-between"
        alignItems="center"
        bg="primary.300"
        p="2"
        safeAreaTop
        flexDir="row"
        borderBottomColor="border.400"
        borderWidth="0.5"
      >
        <InputField
          placeholder="Search for tags"
          w="full"
          size="md"
          rounded="6"
          autoCorrect={false}
          autoCapitalize="none"
          InputLeftElement={<Icon as={<Feather name="search" />} ml="3" />}
          controlProps={{ control, name: 'tagFilter' }}
        />
      </Box>

      <FlashList
        data={tags}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={40}
        ItemSeparatorComponent={ItemSeparatorComponent}
        contentContainerStyle={styles.flashList}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={handleRefetch}
            tintColor="#F07123"
          />
        }
      />
    </Box>
  );
}

const styles = StyleSheet.create({
  flashList: {
    padding: 8,
  },
});
