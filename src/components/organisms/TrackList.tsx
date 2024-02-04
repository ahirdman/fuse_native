import { SpotifyTrack } from '@/services/spotify/tracks/tracks.interface';
import { FlashList } from '@shopify/flash-list';
import { Box, VStack } from 'native-base';
import { IVStackProps } from 'native-base/lib/typescript/components/primitives/Stack/VStack';
import { RefreshControl, StyleSheet } from 'react-native';
import TrackRow from '../molecules/TrackRow';

const ITEM_HEIGHT = 40;

interface TrackListProps extends IVStackProps {
  onTrackPress(id: string): void;
  onEndReached(): void;
  onRefetch(): void;
  tracks: SpotifyTrack[];
  isRefreshing: boolean;
}

function TracksList({
  onTrackPress,
  onEndReached,
  onRefetch,
  tracks,
  isRefreshing,
  ...props
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

  const ItemSeparatorComponent = () => <Box h="2" />;

  const keyExtractor = (item: SpotifyTrack) => item.id;

  return (
    <VStack boxSize="full" {...props}>
      <FlashList
        data={tracks}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReachedThreshold={0.3}
        onEndReached={onEndReached}
        estimatedItemSize={ITEM_HEIGHT}
        ItemSeparatorComponent={ItemSeparatorComponent}
        refreshing={isRefreshing}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefetch}
            tintColor="#F07123"
          />
        }
        contentContainerStyle={styles.flashList}
      />
    </VStack>
  );
}

const styles = StyleSheet.create({
  flashList: {
    padding: 8,
  },
});

export default TracksList;
