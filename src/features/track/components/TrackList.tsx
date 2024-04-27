import {
  type ContentStyle,
  FlashList,
  type FlashListProps,
} from '@shopify/flash-list';
import { type ReactNode, useRef } from 'react';
import { LayoutAnimation } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import { hapticFeedback } from 'util/haptic';

import { SwipableTrackRow } from 'track/components/SwipeAbleTrackRow';
import { TrackRow } from 'track/components/TrackRow';
import { useRemoveTagFromTrack } from 'track/queries/removeTagFromTrack';
import type { SpotifyTrack } from 'track/track.interface';

const ITEM_HEIGHT = 56;

interface TrackListProps
  extends Omit<FlashListProps<SpotifyTrack>, 'renderItem' | 'data'> {
  onTrackPress(id: string): void;
  trackMenu?(): ReactNode;
  isSwipeable?: boolean | undefined;
  tracks?: SpotifyTrack[] | undefined;
  tagId: number;
  listStyle?: ContentStyle | undefined;
}

export function TracksList({
  onTrackPress,
  tracks,
  isSwipeable = false,
  tagId,
  listStyle,
  ...flashListProps
}: TrackListProps) {
  const listRef = useRef<FlashList<SpotifyTrack> | null>(null);
  const swipedRowActive = useSharedValue<string | null>(null);

  const { mutate: removeTag } = useRemoveTagFromTrack();

  function remoteTrackRow(trackId: string) {
    hapticFeedback('Medium');
    removeTag({ tagId, trackId });

    listRef.current?.prepareForLayoutAnimationRender();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }

  const renderItem = ({ item }: { item: SpotifyTrack }) => {
    if (isSwipeable) {
      return (
        <SwipableTrackRow
          track={item}
          height={ITEM_HEIGHT}
          onPress={() => onTrackPress(item.id)}
          deleteAction={() => remoteTrackRow(item.id)}
          swipedRowActive={swipedRowActive}
        />
      );
    }

    return (
      <TrackRow
        track={item}
        height={ITEM_HEIGHT}
        onPress={() => onTrackPress(item.id)}
      />
    );
  };

  const keyExtractor = (item: SpotifyTrack) => item.id;

  return (
    <FlashList
      data={tracks}
      ref={listRef}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      estimatedItemSize={ITEM_HEIGHT}
      contentContainerStyle={listStyle}
      {...flashListProps}
    />
  );
}
