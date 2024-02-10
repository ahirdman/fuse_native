import { Palette } from '@tamagui/lucide-icons';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { returnedResults } from 'reanimated-color-picker';
import { XStack, YStack, YStackProps } from 'tamagui';

import { assertIsDefined } from 'util/assert';
import { showToast } from 'util/toast';

import { Button } from 'components/Button';
import { ColorPickerModal } from 'components/ColorPickerModal';
import { IconButton } from 'components/IconButton';
import { InputField } from 'components/InputField';
import {
  useAddTagToTrackMutation,
  useCreateTagMutation,
  useGetAllTagsQuery,
} from 'tag/queries/tags.endpoints';
import { TagSection } from 'track/components/TagSection';
import { useGetUserSavedTracksQuery } from 'track/queries/tracks.endpoints';
import { UserTracksReq } from 'track/tracks.interface';

interface TagFormInput {
  tagName: string;
}

interface CreateTagFormProps extends YStackProps {
  trackId: string;
  originalArgs: UserTracksReq;
}

export function TagFormFooter({
  trackId,
  originalArgs,
  ...props
}: CreateTagFormProps) {
  const [tagColor, setTagColor] = useState('#FFFFFF');
  const [showModal, setShowModal] = useState(false);
  const [tagAddView, setTagAddView] = useState<'new' | 'existing'>('new');

  const { track } = useGetUserSavedTracksQuery(originalArgs, {
    selectFromResult: ({ data }) => ({
      track: data?.items.find((item) => item.id === trackId),
    }),
  });

  const [tagTrack, { isLoading }] = useCreateTagMutation();
  const [addTagToTrack] = useAddTagToTrackMutation();
  const { data } = useGetAllTagsQuery({ exclude: { trackId: trackId } });

  const { control, handleSubmit } = useForm<TagFormInput>({
    defaultValues: {
      tagName: '',
    },
  });

  async function handlePress(data: TagFormInput) {
    assertIsDefined(tagColor);
    assertIsDefined(track);

    const result = await tagTrack({
      color: tagColor,
      name: data.tagName,
      track,
    });

    if ('error' in result) {
      showToast({
        title: 'Something went wrong',
        preset: 'error',
        message: 'Could not create tag',
      });
    }
  }

  function onSelectColor(colors: returnedResults) {
    setTagColor(colors.hex);
  }

  async function handleTagPress(tagId: number) {
    assertIsDefined(track);
    const result = await addTagToTrack({ tagId, track });

    if ('error' in result) {
      showToast({
        title: 'Something went wrong',
        preset: 'error',
        message: 'Could not add tag to track',
      });
    }
  }

  return (
    <YStack {...props}>
      <XStack justifyContent="space-between" alignItems="baseline">
        <Button
          type="teritary"
          label="Create new tag"
          _text={{
            color: tagAddView === 'new' ? 'white' : 'border.400',
          }}
          onPress={() => setTagAddView('new')}
        />
        <Button
          type="teritary"
          label="Add existing tag"
          _text={{
            color: tagAddView === 'existing' ? 'white' : 'border.400',
          }}
          onPress={() => setTagAddView('existing')}
        />
      </XStack>

      <YStack gap={8} minHeight={84}>
        {tagAddView === 'new' && (
          <>
            <XStack w="89%">
              <InputField
                controlProps={{ control, name: 'tagName' }}
                placeholder="Name"
                w="95%"
              />
              <IconButton
                onPress={() => setShowModal(true)}
                icon={<Palette size={16} color={tagColor} />}
              />
            </XStack>

            <Button
              type="secondary"
              label="Create New Tag"
              onPress={handleSubmit(handlePress)}
              isLoading={isLoading}
            />
            <ColorPickerModal
              isVisible={showModal}
              onComplete={onSelectColor}
              setIsVisible={setShowModal}
            />
          </>
        )}
        {tagAddView === 'existing' && (
          <TagSection
            tags={data}
            onTagPress={handleTagPress}
            emptyListLabel="All tags added to track"
          />
        )}
      </YStack>
    </YStack>
  );
}
