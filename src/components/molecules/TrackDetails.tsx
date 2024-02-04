import { SpotifyTrack } from '@/services/spotify/tracks/tracks.interface';
import { HStack, Text, VStack } from 'native-base';
import { IVStackProps } from 'native-base/lib/typescript/components/primitives/Stack/VStack';

interface TrackDetailsProps extends IVStackProps {
  track: Pick<SpotifyTrack, 'name' | 'artist' | 'duration'>;
}

function TrackDetails({ track, ...props }: TrackDetailsProps) {
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

function formatMsDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

export default TrackDetails;
