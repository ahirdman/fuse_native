import { Tags } from '@tamagui/lucide-icons';
import { Stack, View, type ViewProps, XStack, YStack } from 'tamagui';

import { StyledImage } from 'components/Image';
import { Text } from 'components/Text';
import type { SpotifyTrack } from 'track/track.interface';

interface TrackRowProps extends ViewProps {
  onPress?(): void;
  deleteAction?(): void;
  track: SpotifyTrack;
  height: number;
  isTagged?: boolean;
}

export function TrackRow({
  track,
  height,
  onPress,
  isTagged,
  ...props
}: TrackRowProps) {
  return (
    <View
      accessibilityRole="button"
      onPress={onPress}
      pressStyle={{ bg: '$primary600', borderRadius: 4, opacity: 0.5 }}
      {...props}
    >
      <XStack h={height} w="100%">
        <StyledImage
          source={track.albumCovers[track.albumCovers.length - 1]?.url}
          alt="album-image"
          accessibilityIgnoresInvertColors
          contain="inherit"
          w={44}
          h={44}
          mr={8}
          alignSelf="center"
        />

        <XStack justifyContent="space-between" alignItems="center" flex={1}>
          <YStack justifyContent="space-around" flex={1} pr={8}>
            <Text
              color="$white"
              numberOfLines={1}
              fontWeight="500"
              fontSize="$4"
              lineHeight="$1"
              selectable={false}
            >
              {track.name}
            </Text>

            <Text
              color="$lightText"
              numberOfLines={1}
              fontSize="$3"
              lineHeight="$2"
              selectable={false}
            >
              {`${track.artist ?? 'NA'} - ${track.album}`}
            </Text>
          </YStack>

          {isTagged && (
            <Stack
              bg="$primary800"
              w="$3"
              h="$3"
              borderRadius="$12"
              justifyContent="center"
              alignItems="center"
            >
              <Tags size={18} color="$brandDark" />
            </Stack>
          )}
        </XStack>
      </XStack>
    </View>
  );
}
