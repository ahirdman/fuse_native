import { ContentStyle, FlashList } from '@shopify/flash-list';
import { ReactNode } from 'react';
import { RefreshControl } from 'react-native';
import { YStack } from 'tamagui';

import TrackRow from 'track/components/TrackRow';
import { SpotifyTrack } from 'track/track.interface';

const ITEM_HEIGHT = 40;

interface TrackListProps {
  onTrackPress(id: string): void;
  trackMenu?(): ReactNode;
  onEndReached(): void;
  onRefetch(): void;
  tracks: SpotifyTrack[];
  isRefreshing: boolean;
  listStyle?: ContentStyle | undefined;
}

export function TracksList({
  onTrackPress,
  onEndReached,
  onRefetch,
  tracks,
  isRefreshing,
  listStyle: style,
}: TrackListProps) {
  const renderItem = ({ item }: { item: SpotifyTrack }) => {
    return (
      <TrackRow
        track={item}
        height={ITEM_HEIGHT}
        onPress={() => onTrackPress(item.id)}
      />
    );
  };

  const ItemSeparatorComponent = () => <YStack h={8} />;

  const keyExtractor = (item: SpotifyTrack) => item.id;

  return (
    <FlashList
      data={tracks}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReachedThreshold={0.3}
      onEndReached={onEndReached}
      estimatedItemSize={ITEM_HEIGHT}
      ItemSeparatorComponent={ItemSeparatorComponent}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefetch}
          tintColor="#F07123"
        />
      }
      contentContainerStyle={style}
    />
  );
}
