import { Image } from 'expo-image';

import { Feather } from '@expo/vector-icons';
import { Box, Icon, Pressable, VStack } from 'native-base';
import { StyleSheet } from 'react-native';

import PageView from '@/components/atoms/PageView';
import { useGetUserSavedTracksQuery } from '@/services/spotify/tracks/tracks.endpoints';
import {
  useDeleteTagFromTrackMutation,
  useGetTagsForTrackQuery,
} from '@/services/supabase/tags/tags.endpoints';

import Alert from '@/components/molecules/Alert';
import TagSection from '@/components/molecules/TagSection';
import TrackDetails from '@/components/molecules/TrackDetails';
import TagFormFooter from '@/components/organisms/tag-form.footer';
import type { TrackListScreenProps } from '@/navigation.types';
import * as Burnt from 'burnt';

function Track({ route, navigation }: TrackListScreenProps<'Track'>) {
  const {
    params: { originalArgs, trackId },
  } = route;
  const { data: userSavedTrack } = useGetUserSavedTracksQuery(
    {
      ...originalArgs,
    },
    {
      selectFromResult: ({ data, ...props }) => ({
        data: data?.items.find((track) => track.id === trackId),
        ...props,
      }),
    },
  );

  const {
    data: trackTags,
    isLoading: trackTagsLoading,
    isError: trackTagsError,
  } = useGetTagsForTrackQuery({
    trackId,
  });

  const [deleteTag] = useDeleteTagFromTrackMutation();

  if (!userSavedTrack) {
    return (
      <PageView>
        <Alert label="Error finding track" />
      </PageView>
    );
  }

  async function handleTrackTagPress(tagId: number) {
    const result = await deleteTag({ tagId });

    if ('error' in result) {
      Burnt.toast({
        title: 'Something went wrong',
        preset: 'error',
        message: 'Could not delete tag',
      });
    }
  }

  function handleClosePress() {
    navigation.goBack();
  }

  const [albumCover] = userSavedTrack.albumCovers;

  return (
    <Box bg="primary.700" boxSize="full">
      <Box position="relative" borderBottomWidth="1" borderColor="border.500">
        <Pressable
          accessibilityRole="button"
          position="absolute"
          zIndex={1}
          right="2"
          top="2"
          onPress={handleClosePress}
        >
          {({ isPressed }) => (
            <Box rounded="full" bg="primary.600" p="1" shadow={4}>
              <Icon
                as={<Feather name="x" />}
                size="lg"
                color={isPressed ? 'singelton.white' : 'border.300'}
              />
            </Box>
          )}
        </Pressable>

        <Image
          source={albumCover?.url}
          alt="album-image"
          accessibilityIgnoresInvertColors
          style={styles.albumImage}
        />
      </Box>

      <TrackDetails track={userSavedTrack} px="4" pt="4" />

      <VStack
        px="4"
        mt="4"
        mb="12"
        justifyContent="space-between"
        space="2"
        flex={1}
      >
        <TagSection
          label="Track Tags"
          tags={trackTags}
          isLoading={trackTagsLoading}
          isError={trackTagsError}
          onTagPress={handleTrackTagPress}
          emptyListLabel="No tags for this track yet..."
        />

        <TagFormFooter trackId={trackId} originalArgs={originalArgs} />
      </VStack>
    </Box>
  );
}

const styles = StyleSheet.create({
  albumImage: {
    width: '100%',
    height: 320,
  },
});

export default Track;
