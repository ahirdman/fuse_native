import { ArrowLeft } from '@tamagui/lucide-icons';
import * as Linking from 'expo-linking';
import { type ReactNode, useRef } from 'react';
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

import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Blur, Canvas, Image, useImage } from '@shopify/react-native-skia';
import { selectUserId } from 'auth/auth.slice';
import { DetachedModal } from 'components/DetachedModal';
import { useAppSelector } from 'store/hooks';
import { TagBadge } from 'tag/components/TagBadge';
import { TagForm } from 'tag/components/Tagform';
import { useCreateTag } from 'tag/queries/createTag';
import { useGetTrack } from 'track/queries/getTrack';
import { useGetTrackTags } from 'track/queries/getTrackTags';
import { useIsSpotifyInstalled } from 'track/queries/isSpotifyInstalled';
import { useRemoveTagFromTrack } from 'track/queries/removeTagFromTrack';
import type { SpotifyTrack } from 'track/track.interface';

export function Track({
  route: {
    params: { trackId },
  },
  navigation,
}: RootStackScreenProps<'Track'>) {
  const { data: track, isLoading, isError } = useGetTrack(trackId);
  const { mutate: createTag } = useCreateTag();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();

  if (isLoading) {
    return (
      <YStack fullscreen bg="$primary700" justifyContent="center">
        <Spinner />
      </YStack>
    );
  }

  if (isError) {
    return (
      <YStack fullscreen bg="$primary700">
        <Alert label="Error fetching track" />
      </YStack>
    );
  }

  const albumCoverUrl = track?.albumCovers[0]?.url;

  return (
    <YStack bg="$primary700" fullscreen gap={12} pb={insets.bottom}>
      <Stack
        position="absolute"
        top={insets.top}
        left={16}
        zIndex={10}
        onPress={navigation.goBack}
        h={44}
        w={44}
      >
        <ArrowLeft color="$white" />
      </Stack>

      <AlbumArtworkWithBackground image={albumCoverUrl} />

      <TrackInfo track={track} />

      <TrackTags trackId={trackId} />

      <XStack gap={16} mx={8}>
        <Button flex={1} onPress={() => bottomSheetRef.current?.present()}>
          Create new tag
        </Button>
        <Button flex={1} onPress={() => navigation.push('AddTag', { trackId })}>
          Add existing tag
        </Button>
      </XStack>

      <DetachedModal ref={bottomSheetRef}>
        <TagForm
          label="Create New Tag"
          closeAction={() => bottomSheetRef.current?.close()}
          confirmAction={({ name, color }) =>
            createTag(
              { name, color, trackId },
              {
                onSuccess: () => {
                  bottomSheetRef.current?.close();
                },
              },
            )
          }
        />
      </DetachedModal>
    </YStack>
  );
}

interface BlurImageFilterProps {
  image?: string;
}

function AlbumArtworkWithBackground({ image }: BlurImageFilterProps) {
  const parsedImage = useImage(image);
  const insets = useSafeAreaInsets();
  if (!image) {
    return null;
  }

  return (
    <YStack w="$full" jc="center" ai="center" pt={insets.top}>
      <Canvas style={{ height: '250%', width: '100%', position: 'absolute' }}>
        <Image x={60} y={0} width={280} height={280} image={parsedImage}>
          <Blur blur={256} />
        </Image>
      </Canvas>

      <StyledImage source={image} h={250} w={250} />
    </YStack>
  );
}

const spotifyAppStoreUrl =
  'https://apps.apple.com/id/app/spotify-music-and-podcasts/id324684580';

interface TrackInfoProps {
  track?: SpotifyTrack | undefined;
}

function TrackInfo({ track }: TrackInfoProps) {
  const { data: isSpotifyInstalled, isLoading: isLoadingSpotifyStatus } =
    useIsSpotifyInstalled(track?.uri);

  function handleOpenSpotify(trackUri: string) {
    const url = isSpotifyInstalled ? trackUri : spotifyAppStoreUrl;

    Linking.openURL(url);
  }

  if (!track) {
    return null;
  }

  return (
    <YStack p={16} mx={8} bg="#151515" borderRadius={8}>
      <Text fontSize="$8" fontWeight="800" color="white" numberOfLines={1}>
        {track.name}
      </Text>

      <Text fontSize="$4" fontWeight="600" color="$lightHeader">
        {track.artist}
      </Text>

      <XStack
        alignSelf="flex-end"
        gap={8}
        alignItems="center"
        bg="$primary600"
        py={4}
        px={8}
        borderRadius={8}
        pressStyle={{ bg: '$brandDark' }}
        onPress={track.uri ? () => handleOpenSpotify(track.uri) : undefined}
      >
        <StyledImage
          source={require('../../../../assets/icons/Spotify_Icon_White.png')}
          h={20}
          w={20}
        />

        <Text
          fontSize="$4"
          fontWeight="600"
          color="$lightHeader"
          textAlign="right"
          textTransform="uppercase"
        >
          {isLoadingSpotifyStatus ? (
            <Spinner />
          ) : isSpotifyInstalled ? (
            'open spotify'
          ) : (
            'get spotify free'
          )}
        </Text>
      </XStack>
    </YStack>
  );
}

interface TrackTagsProps {
  trackId: string;
}

function TrackTags({ trackId }: TrackTagsProps) {
  const userId = useAppSelector(selectUserId);
  const { mutate: removeTagFromTrack } = useRemoveTagFromTrack();
  const {
    data: trackTags,
    isLoading: trackTagsLoading,
    isError: trackTagsError,
  } = useGetTrackTags({ trackId, userId });

  return (
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
                color={{ type: 'tag', color: tag.color }}
                onPress={() => removeTagFromTrack({ trackId, tagId: tag.id })}
                key={tag.id}
                mr={8}
              />
            ))
          ) : (
            <YStack w="$full" h="$full">
              <Alert
                type="info"
                label="No tags for this track yet"
                size="small"
              />
            </YStack>
          )}
        </ScrollView>
      </YStack>
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
