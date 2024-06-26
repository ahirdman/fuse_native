import { FlashList } from '@shopify/flash-list';
import { useCallback, useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatePresence, Button, YStack } from 'tamagui';

import { Text } from 'components/Text';
import type { RootStackScreenProps } from 'navigation.types';
import { hapticFeedback } from 'util/haptic';

import { selectUserId } from 'auth/auth.slice';
import { ListEmptyComponent } from 'components/ListEmptyComponent';
import { ListFooterComponent } from 'components/ListFooter';
import { useAppSelector } from 'store/hooks';
import { TagRow } from 'tag/components/TagRow';
import { useGetTagsWithTrackIds } from 'tag/queries/getTags';
import { useAddTagToTrack } from 'track/queries/tagTrack';

interface RenderItemProps {
  item: { name: string; color: string; id: number };
  index: number;
  extraData?: {
    selecteble: boolean;
    selectedTags: number[];
  };
}

type Props = RootStackScreenProps<'AddTag'>;

export function AddTag({
  route: {
    params: { trackId },
  },
  navigation,
}: Props) {
  const userId = useAppSelector(selectUserId);
  const [selectMultiple, setSelectMultiple] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  const { data, isFetching, isError } = useGetTagsWithTrackIds({
    excledeTrackId: trackId,
    userId,
  });
  const { mutateAsync: addTag } = useAddTagToTrack();

  const insets = useSafeAreaInsets();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          fontWeight="bold"
          userSelect={undefined}
          onPress={() => setSelectMultiple(!selectMultiple)}
          pressStyle={{
            color: '$border300',
          }}
        >
          {selectMultiple ? 'Cancel' : 'Select'}
        </Text>
      ),
    });
  }, [selectMultiple, navigation.setOptions]);

  const handleRowPress = useCallback(
    (tagId: number) => {
      if (selectMultiple) {
        const tagIdIsSelected = selectedTagIds.some((item) => item === tagId);

        tagIdIsSelected
          ? setSelectedTagIds(selectedTagIds.filter((id) => id !== tagId))
          : setSelectedTagIds((prev) => [...prev, tagId]);
      } else {
        addTag(
          { trackId, tagIds: [tagId], userId },
          {
            onSuccess: () => {
              navigation.goBack();
            },
          },
        );
      }
    },
    [
      selectMultiple,
      trackId,
      selectedTagIds,
      userId,
      navigation.goBack,
      addTag,
    ],
  );

  function renderItem({ item, extraData }: RenderItemProps) {
    return (
      <TagRow
        name={item.name}
        color={item.color}
        onPress={() => handleRowPress(item.id)}
        key={item.id}
        selecteble={extraData?.selecteble === true}
        isSelected={
          extraData?.selectedTags
            ? extraData.selectedTags.some((id) => id === item.id)
            : false
        }
        size="small"
      />
    );
  }

  const ItemSeparatorComponent = () => <YStack h={12} />;

  function onSelectPress() {
    hapticFeedback('Medium');
    addTag(
      { trackId, tagIds: selectedTagIds, userId },
      {
        onSuccess: () => {
          navigation.goBack();
        },
      },
    );
  }

  return (
    <YStack fullscreen bg="$primary700" pb={insets.bottom}>
      <FlashList
        data={data}
        extraData={{ selecteble: selectMultiple, selectedTags: selectedTagIds }}
        renderItem={renderItem}
        estimatedItemSize={33}
        ListEmptyComponent={
          isFetching ? null : (
            <ListEmptyComponent
              isError={isError}
              isFiltered={false}
              defaultLabel="No tags created"
              size="small"
            />
          )
        }
        ListFooterComponent={isFetching ? <ListFooterComponent /> : null}
        ItemSeparatorComponent={ItemSeparatorComponent}
        contentContainerStyle={{ padding: 8 }}
      />

      <AnimatePresence>
        {selectMultiple && (
          <Button
            mx={24}
            disabled={!selectedTagIds.length}
            borderColor="$border500"
            borderWidth={1}
            key="add-tags"
            animation="quick"
            onPress={onSelectPress}
            enterStyle={{
              y: 100,
            }}
            exitStyle={{
              y: 100,
            }}
          >
            Add Tags
          </Button>
        )}
      </AnimatePresence>
    </YStack>
  );
}
