import { HStack, Text, VStack } from 'native-base';
import { IVStackProps } from 'native-base/lib/typescript/components/primitives/Stack/VStack';

import { formatMsDuration } from 'util/index';

import { SpotifyTrack } from 'track/tracks.interface';

interface TrackDetailsProps extends IVStackProps {
  track: Pick<SpotifyTrack, 'name' | 'artist' | 'duration'>;
}

export function TrackDetails({ track, ...props }: TrackDetailsProps) {
  const trackDuration = formatMsDuration(track.duration);

  return (
    <VStack {...props}>
      <Text
        fontSize="2xl"
        fontWeight={800}
        color="singelton.white"
        numberOfLines={1}
      >
        {track.name}
      </Text>
      <HStack justifyContent="space-between" alignItems="baseline">
        <Text fontSize="lg" fontWeight={600} color="singelton.lightHeader">
          {track.artist}
        </Text>
        <Text>{trackDuration}</Text>
      </HStack>
    </VStack>
  );
}
