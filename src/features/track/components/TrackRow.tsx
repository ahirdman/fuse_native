import { Image } from 'expo-image';
import { Text } from 'native-base';
import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { Stack, View, XStack, YStack } from 'tamagui';

import type { SpotifyTrack } from 'track/tracks.interface';

interface TrackRowProps {
  onPress(): void;
  EndElement?(): ReactNode;
  track: SpotifyTrack;
  height: number;
}

function TrackRow({ track, height, onPress, EndElement }: TrackRowProps) {
  return (
    <View accessibilityRole="button" onPress={onPress}>
      <XStack h={height} w="100%">
        <Stack h={height} w={height} mr={8}>
          <Image
            source={track.albumCovers[track.albumCovers.length - 1]?.url}
            alt="album-image"
            accessibilityIgnoresInvertColors
            style={styles.image}
          />
        </Stack>

        <XStack justifyContent="space-between" alignItems="center" w="90%">
          <YStack justifyContent="center" maxWidth="80%">
            <Text color="singelton.white" fontSize="sm" noOfLines={1}>
              {track.name}
            </Text>

            <Text fontSize="xs" noOfLines={1}>
              {`${track.artist ?? 'NA'} - ${track.album}`}
            </Text>
          </YStack>

          {EndElement}
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
