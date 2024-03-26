import { Tags } from '@tamagui/lucide-icons';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import { Stack, View, XStack, YStack } from 'tamagui';

import { Text } from 'components/Text';

import type { SpotifyTrack } from 'track/track.interface';

interface TrackRowProps {
  onPress(): void;
  track: SpotifyTrack;
  height: number;
  isTagged?: boolean;
}

function TrackRow({ track, height, onPress, isTagged }: TrackRowProps) {
  return (
    <View
      accessibilityRole="button"
      onPress={onPress}
      pressStyle={{ bg: '$primary600', borderRadius: 4, opacity: 0.5 }}
    >
      <XStack h={height} w="100%">
        <Stack h={height} w={height} mr={8}>
          <Image
            source={track.albumCovers[track.albumCovers.length - 1]?.url}
            alt="album-image"
            accessibilityIgnoresInvertColors
            style={styles.image}
          />
        </Stack>

        <XStack
          justifyContent="space-between"
          alignItems="center"
          flex={1}
          pr={8}
        >
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

          {isTagged && <Tags size={18} color="$brandDark" />}
        </XStack>
      </XStack>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: '100%',
  },
});

export default TrackRow;
