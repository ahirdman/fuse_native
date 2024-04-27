import { ListMinus } from '@tamagui/lucide-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  type SharedValue,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { View, XStack, YStack } from 'tamagui';

import { hapticFeedback } from 'util/haptic';

import { StyledImage } from 'components/Image';
import { Text } from 'components/Text';
import type { SpotifyTrack } from 'track/track.interface';

const AnimatedTamaguiView = Animated.createAnimatedComponent(View);

interface SwipableTrackRowProps {
  deleteAction: () => void;
  onPress?(): void;
  swipedRowActive: SharedValue<string | null>;
  track: SpotifyTrack;
  height: number;
  isTagged?: boolean;
}

const SNAP_DELETE_THRESHOLD = -250;

export function SwipableTrackRow({
  deleteAction,
  onPress,
  swipedRowActive,
  height,
  track,
}: SwipableTrackRowProps) {
  const isDeleteButtonSnap = useSharedValue(false);
  const trackRpwposition = useSharedValue(0);
  const onSnapDelete = useSharedValue(false);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((e) => {
      swipedRowActive.value = track.id;

      if (trackRpwposition.value < SNAP_DELETE_THRESHOLD) {
        onSnapDelete.value = true;
      } else {
        onSnapDelete.value = false;
      }

      if (isDeleteButtonSnap.value) {
        trackRpwposition.value = -height + e.translationX;
      } else {
        if (e.translationX > 0) {
          return;
        }

        trackRpwposition.value = e.translationX;
      }
    })
    .onEnd(() => {
      if (onSnapDelete.value) {
        runOnJS(deleteAction)();
        trackRpwposition.value = withTiming(0, { duration: 100 });
        isDeleteButtonSnap.value = false;
        return;
      }

      if (trackRpwposition.value < -height) {
        trackRpwposition.value = withTiming(-height, { duration: 100 });
        isDeleteButtonSnap.value = true;
      } else {
        trackRpwposition.value = withTiming(0, { duration: 100 });
        isDeleteButtonSnap.value = false;
      }
    });

  const animatedTrackRow = useAnimatedStyle(() => ({
    transform: [
      {
        translateX:
          swipedRowActive.value === track.id
            ? trackRpwposition.value
            : withTiming(0, { duration: 150 }),
      },
    ],
  }));

  const animatedActionRow = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: onSnapDelete.value
          ? withTiming(trackRpwposition.value + height, { duration: 50 })
          : withTiming(0, { duration: 50 }),
      },
    ],
  }));

  useAnimatedReaction(
    () => onSnapDelete.value,
    (currentValue) => {
      if (currentValue) {
        runOnJS(hapticFeedback)('Medium');
      }
    },
  );

  return (
    <View flex={1} bg="$error500">
      <AnimatedTamaguiView
        h="100%"
        position="absolute"
        right={0}
        style={[animatedActionRow]}
        bg="$error500"
        w={height}
        alignItems="center"
        justifyContent="center"
        onPress={deleteAction}
      >
        <ListMinus />
      </AnimatedTamaguiView>

      <GestureDetector gesture={panGesture}>
        <AnimatedTamaguiView
          style={[animatedTrackRow]}
          h={height}
          bg="$primary700"
          px={8}
          onPress={onPress}
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
            </XStack>
          </XStack>
        </AnimatedTamaguiView>
      </GestureDetector>
    </View>
  );
}
