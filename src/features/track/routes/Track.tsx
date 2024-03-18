import { ArrowDown } from '@tamagui/lucide-icons';
import { ReactNode, useState } from 'react';
import { getColors } from 'react-native-image-colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Button,
  H6,
  ScrollView,
  Sheet,
  Spinner,
  Stack,
  XStack,
  YStack,
} from 'tamagui';

import { Alert } from 'components/Alert';
import { StyledImage } from 'components/Image';
import { Text } from 'components/Text';
import { RootStackScreenProps } from 'navigation.types';

import { useQuery } from '@tanstack/react-query';
import { TagBadge } from 'tag/components/TagBadge';
import { TagForm } from 'tag/components/Tagform';
import { useCreateTag } from 'tag/queries/createTag';
import { useGetTrack } from 'track/queries/getTrack';
import { useGetTrackTags } from 'track/queries/getTrackTags';
import { useRemoveTagFromTrack } from 'track/queries/removeTagFromTrack';

const useAlbumCoverColors = (albumCoverUrl: string) =>
  useQuery({
    queryKey: ['alubmColors', albumCoverUrl],
    queryFn: async () => {
      const result = await getColors(albumCoverUrl);

      if (result.platform !== 'ios') {
        throw new Error('Image color result platform missmatch');
      }

      return result;
    },
    enabled: !!albumCoverUrl,
  });

export function Track({
  route: { params: { trackId } },
  navigation,
}: RootStackScreenProps<'Track'>) {
  const { data: track, isLoading, isError } = useGetTrack(trackId);
  const { mutate: removeTagFromTrack } = useRemoveTagFromTrack();
  const { mutate: createTag } = useCreateTag();
  const { data: albumColors } = useAlbumCoverColors(
    track?.albumCovers[0]?.url ?? '',
  );
  const {
    data: trackTags,
    isLoading: trackTagsLoading,
    isError: trackTagsError,
  } = useGetTrackTags(trackId);

  const insets = useSafeAreaInsets();
  const [createTagSheetOpen, setCreateTagSheetOpen] = useState(false);

  if (isLoading) {
    return (
      <YStack fullscreen bg="$primary700">
        <Spinner />
      </YStack>
    );
  }

  if (isError || !track) {
    return (
      <YStack fullscreen bg="$primary700">
        <Alert label="Error fetching track" />
      </YStack>
    );
  }

  const [albumCover] = track.albumCovers;
  //const trackDuration = formatMsDuration(track.duration);

  return (
    <YStack
      bg="$primary700"
      fullscreen
      gap={12}
      pb={insets.bottom}
      pt={insets.top}
    >
      <Stack
        position="absolute"
        zIndex={10}
        top={insets.top}
        right={16}
        onPress={navigation.goBack}
      >
        <ArrowDown pressStyle={{ color: '$brandDark' }} />
      </Stack>
      <XStack justifyContent="center">
        <XStack
          bg="$primary700"
          elevation={10}
          shadowColor={albumColors?.detail ?? '$primary500'}
          shadowOpacity={0.2}
          shadowRadius={40}
        >
          <StyledImage source={albumCover?.url} h={250} w={250} />
        </XStack>
      </XStack>

      <YStack p={16} mx={8} bg="#151515" borderRadius={8}>
        <Text fontSize="$8" fontWeight="800" color="white" numberOfLines={1}>
          {track.name}
        </Text>

        <Text fontSize="$4" fontWeight="600" color="$lightHeader">
          {track.artist}
        </Text>
      </YStack>

      <YStack justifyContent="space-between" flex={1}>
        <YStack
          mx={8}
          mb={16}
          px={16}
          pt={8}
          pb={16}
          bg="#151515"
          borderRadius={8}
          justifyContent="space-between"
          gap={8}
          flex={1}
        >
          <H6 color="$lightText" textTransform="uppercase">
            Track Tags
          </H6>

          <ScrollView
            contentContainerStyle={{
              flex: 1,
              flexWrap: 'wrap',
              flexDirection: 'row',
              rowGap: 8,
            }}
          >
            {trackTagsLoading && (
              <XStack
                w="100%"
                minHeight={20}
                justifyContent="center"
                alignItems="center"
              >
                <Spinner color="brand.light" />
              </XStack>
            )}

            {trackTagsError && (
              <XStack w="100%" minHeight={20} justifyContent="center">
                <Alert label="Error fetching tags" />
              </XStack>
            )}

            {trackTags?.length ? (
              trackTags.map((tag) => (
                <TagBadge
                  name={tag.name}
                  color={tag.color}
                  onPress={() => removeTagFromTrack({ trackId, tagId: tag.id })}
                  key={tag.id}
                  mr={8}
                />
              ))
            ) : (
              <YStack justifyContent="center" w="100%" h="100%">
                <Alert variant="info" label="No tags for this track yet" />
              </YStack>
            )}
          </ScrollView>
        </YStack>

        <XStack gap={16} mx={8}>
          <Button flex={1} onPress={() => setCreateTagSheetOpen(true)}>
            Create new tag
          </Button>
          <Button
            flex={1}
            onPress={() => navigation.push('AddTag', { trackId })}
          >
            Add existing tag
          </Button>
        </XStack>
      </YStack>

      <Sheet
        moveOnKeyboardChange
        open={createTagSheetOpen}
        animation="quick"
        snapPointsMode="fit"
        disableDrag
      >
        <Sheet.Overlay
          onPress={() => setCreateTagSheetOpen(false)}
          animation="quick"
          enterStyle={{ opacity: 0.5 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Frame padding={20} borderRadius={28} pb={48}>
          <TagForm
            label="Create New Tag"
            closeAction={() => setCreateTagSheetOpen(false)}
            confirmAction={({ name, color }) =>
              createTag(
                { name, color, trackId: trackId },
                {
                  onSuccess: () => {
                    setCreateTagSheetOpen(false);
                  },
                },
              )
            }
          />
        </Sheet.Frame>
      </Sheet>
    </YStack>
  );
}

interface TrackMetaDataRowProps {
  icon: ReactNode;
  metaData: string;
}

export function TrackMetaDataRow({ icon, metaData }: TrackMetaDataRowProps) {
  return (
    <XStack w="100%" px={16} gap={16} alignItems="center">
      {icon}
      <Text color="$lightText">{metaData}</Text>
    </XStack>
  );
}
