import { Check, Tags } from '@tamagui/lucide-icons';
import { Checkbox, Stack, View, type ViewProps, XStack, YStack } from 'tamagui';

import { StyledImage } from 'components/Image';
import { Text } from 'components/Text';
import type { SpotifyTrack } from 'track/track.interface';

interface TrackRowProps extends ViewProps {
  onPress?(): void;
  deleteAction?(): void;
  track: SpotifyTrack;
  height: number;
  isTagged?: boolean;
  selectable?: boolean;
  isSelected?: boolean;
}

export function TrackRow({
  track,
  height,
  onPress,
  isTagged,
  selectable,
  isSelected,
  ...props
}: TrackRowProps) {
  return (
    <View
      role="button"
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
              userSelect={undefined}
            >
              {track.name}
            </Text>

            <Text
              color="$lightText"
              numberOfLines={1}
              fontSize="$3"
              lineHeight="$2"
              userSelect={undefined}
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

          {selectable && (
            <Checkbox
              size="$4"
              alignSelf="center"
              mr={16}
              radiused
              key={track.id}
              checked={isSelected}
              onPress={onPress}
            >
              <Checkbox.Indicator>
                <Check />
              </Checkbox.Indicator>
            </Checkbox>
          )}
        </XStack>
      </XStack>
    </View>
  );
}
