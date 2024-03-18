import { FlashList } from '@shopify/flash-list';
import { useCallback, useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Label, YStack } from 'tamagui';

import { RootStackScreenProps } from 'navigation.types';
import { hapticFeedback } from 'util/haptic';

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

export function AddTag({ route: { params: { trackId } }, navigation }: Props) {
  const [selectMultiple, setSelectMultiple] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  const { data } = useGetTagsWithTrackIds({ excledeTrackId: trackId });
  const { mutateAsync: addTag } = useAddTagToTrack();

  const insets = useSafeAreaInsets();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        return selectMultiple ? (
          <Label fontWeight="bold" onPress={() => setSelectMultiple(false)}>
            Cancel
          </Label>
        ) : undefined;
      },
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
          { trackId, tagIds: [tagId] },
          {
            onSuccess: () => {
              navigation.goBack();
            },
          },
        );
      }
    },
    [selectMultiple, trackId, selectedTagIds, navigation.goBack, addTag],
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
    if (selectMultiple) {
      addTag(
        { trackId, tagIds: selectedTagIds },
        {
          onSuccess: () => {
            navigation.goBack();
          },
        },
      );
    } else {
      setSelectMultiple(!selectMultiple);
    }
  }

  return (
    <YStack fullscreen bg="$primary700" pb={insets.bottom}>
      <FlashList
        data={data}
        extraData={{ selecteble: selectMultiple, selectedTags: selectedTagIds }}
        renderItem={renderItem}
        estimatedItemSize={33}
        ItemSeparatorComponent={ItemSeparatorComponent}
        contentContainerStyle={{ padding: 8 }}
      />
      <Button
        onPress={onSelectPress}
        mx={8}
        disabled={selectMultiple && !selectedTagIds.length}
        borderColor="$border500"
        borderWidth={1}
      >
        {selectMultiple ? 'Add Tags' : 'Select Multiple'}
      </Button>
    </YStack>
  );
}
