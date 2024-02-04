import Button from '@/components/atoms/Button';
import TagBadge from '@/components/atoms/Tag';
import Alert from '@/components/molecules/Alert';
import ColorPickerModal from '@/components/molecules/ColorPickerModal';
import TracksList from '@/components/organisms/TrackList';
import { TagListScreenProps } from '@/navigation.types';
import { useCreatePlaylistWithTracksMutation } from '@/services/spotify/playlist/playlist.endpoint';
import {
  useGetAllTagsQuery,
  useUpdateTagMutation,
} from '@/services/supabase/tags/tags.endpoints';
import { useGetTracksForTagQuery } from '@/services/supabase/tracks/tracks.endpoint';
import { Feather } from '@expo/vector-icons';
import * as Burnt from 'burnt';
import { HStack, Icon, VStack } from 'native-base';
import { Box, Text } from 'native-base';
import { ReactElement, useState } from 'react';
import { returnedResults } from 'reanimated-color-picker';

function Tag({ route: { params } }: TagListScreenProps<'Tag'>) {
  const [colorModaVisible, setColorModalVisible] = useState(false);
  const { tag } = useGetAllTagsQuery(
    {},
    {
      selectFromResult: ({ data }) => ({
        tag: data?.find((tag) => tag.id === params.id),
      }),
    },
  );

  const { data } = useGetTracksForTagQuery({ tagId: params.id });
  const [createPlaylist, { isLoading }] = useCreatePlaylistWithTracksMutation();
  const [updateTag] = useUpdateTagMutation();

  async function handleExport() {
    const trackUris = data?.map((track) => track.uri) ?? [];

    const result = await createPlaylist({
      name: params.name,
      tracks: trackUris,
      tagId: params.id.toString(),
    });

    if ('error' in result) {
      console.log(result.error);
      Burnt.toast({
        title: 'Something went wrong',
        preset: 'error',
        message: 'Could not create playlist',
      });
    }
  }

  if (!tag) {
    return (
      <Box bg="primary.700" flex={1} safeAreaTop>
        <Alert label="Unable to find tag" />
      </Box>
    );
  }

  function handleColorChange(result: returnedResults) {
    void updateTag({ tagId: params.id, color: result.hex });
  }

  return (
    <Box bg="primary.700" flex={1}>
      <VStack w="full" mt="4" space="4" mb="4" p="2">
        <Cell label="Name">
          <Text>{params.name}</Text>
        </Cell>

        <Cell label="Color" onPress={() => setColorModalVisible(true)}>
          <TagBadge name={tag.color} color={tag.color} size="small" />
        </Cell>

        <Cell label="Tracks">
          <Text>
            {data?.length}{' '}
            {data?.length && data?.length > 1 ? 'Tracks' : 'Track'}
          </Text>
        </Cell>

        <Cell label="Sync status">
          <Text>Not Synced</Text>
        </Cell>

        <HStack justifyContent="space-between">
          <Button
            type="primary"
            label="Sync"
            onPress={handleExport}
            isLoading={isLoading}
          />
        </HStack>
      </VStack>

      {data && (
        <TracksList
          tracks={data}
          onTrackPress={() => {}}
          onRefetch={() => {}}
          onEndReached={() => {}}
          isRefreshing={false}
        />
      )}

      <ColorPickerModal
        isVisible={colorModaVisible}
        setIsVisible={setColorModalVisible}
        onComplete={handleColorChange}
      />
    </Box>
  );
}

interface CellProps {
  children: ReactElement | ReactElement[];
  label: string;
  onPress?(): void;
}

function Cell({ children, label, onPress }: CellProps) {
  return (
    <VStack>
      <Text fontSize="xs">{label}</Text>
      <HStack
        bg="primary.600"
        rounded="4"
        padding="2"
        justifyContent="space-between"
      >
        {children}
        {onPress && (
          <Icon
            alignSelf="center"
            as={<Feather name="edit-2" />}
            onPress={onPress}
          />
        )}
      </HStack>
    </VStack>
  );
}

export default Tag;
