import { ArrowLeft } from '@tamagui/lucide-icons';
import { type ReactNode, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Button,
  H6,
  ScrollView,
  Spinner,
  Stack,
  XStack,
  YStack,
} from 'tamagui';

import { Alert } from 'components/Alert';
import { StyledImage } from 'components/Image';
import { Text } from 'components/Text';
import type { RootStackScreenProps } from 'navigation.types';

import { CreateTagSheet } from 'tag/components/CreateTag.sheet';
import { TagBadge } from 'tag/components/TagBadge';
import { useAlbumCoverColors } from 'track/queries/getAlbumColors';
import { useGetTrack } from 'track/queries/getTrack';
import { useGetTrackTags } from 'track/queries/getTrackTags';
import { useRemoveTagFromTrack } from 'track/queries/removeTagFromTrack';

export function Track({
  route: {
    params: { trackId },
  },
  navigation,
}: RootStackScreenProps<'Track'>) {
  const { data: track, isLoading, isError } = useGetTrack(trackId);
  const { mutate: removeTagFromTrack } = useRemoveTagFromTrack();
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

  if (isLoading || !albumColors) {
    return (
      <YStack fullscreen bg="$primary700" justifyContent="center">
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
        left={16}
        onPress={navigation.goBack}
        h={44}
        w={44}
      >
        <ArrowLeft pressStyle={{ color: '$brandDark' }} />
      </Stack>
      <XStack justifyContent="center">
        <XStack
          bg="$primary700"
          elevation={1}
          shadowColor={albumColors?.primary ?? '$primary500'}
          shadowOpacity={0.8}
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
              <YStack w="$full" h="$full">
                <Alert type="info" label="No tags for this track yet" />
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

      <CreateTagSheet
        isOpen={createTagSheetOpen}
        trackId={trackId}
        closeSheet={() => setCreateTagSheetOpen(false)}
      />
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
