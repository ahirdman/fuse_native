import { FlashList } from '@shopify/flash-list';
import { ListEmptyComponent } from 'components/ListEmptyComponent';
import { ListFooterComponent } from 'components/ListFooter';
import { Text } from 'components/Text';
import type { RootStackScreenProps } from 'navigation.types';
import { useState } from 'react';
import { AnimatePresence, Spinner, View, XStack, YStack } from 'tamagui';
import { TrackRow } from 'track/components/TrackRow';
import { useAddTracksToTag } from 'track/queries/addTrackToTag';
import { useInfiniteSavedTracks } from 'track/queries/getSavedTracks';
import type { SpotifyTrack } from 'track/track.interface';

const ITEM_HEIGHT = 44;
const SEPERATOR_HEIGHT = 8;

type Props = RootStackScreenProps<'AddTracks'>;

export function AddTracks({
  navigation,
  route: {
    params: { tagId },
  },
}: Props) {
  const [trackIdsToAdd, setTrackIdsToAdd] = useState<string[]>([]);
  const {
    data: tracks,
    isError,
    isFetching,
    fetchNextPage,
    isRefetching,
    hasNextPage,
  } = useInfiniteSavedTracks({ filterTaggedTracks: false, trackIds: [] });

  const { mutateAsync, isPending } = useAddTracksToTag();

  function handleTrackPress(trackId: string) {
    const isSelected = trackIdsToAdd.find(
      (selectedId) => selectedId === trackId,
    );
    isSelected
      ? setTrackIdsToAdd((prev) => prev.filter((id) => id !== trackId))
      : setTrackIdsToAdd((prev) => [...prev, trackId]);
  }

  const renderItem = ({ item }: { item: SpotifyTrack }) => (
    <TrackRow
      track={item}
      height={ITEM_HEIGHT}
      onPress={() => handleTrackPress(item.id)}
      selectable
      isSelected={trackIdsToAdd.some((trackId) => trackId === item.id)}
    />
  );

  const keyExtractor = (item: SpotifyTrack) => item.id;
  const ItemSeparatorComponent = () => <YStack h={SEPERATOR_HEIGHT} />;

  function handleEndReached() {
    if (!isFetching && hasNextPage) {
      fetchNextPage();
    }
  }

  return (
    <YStack fullscreen bg="$primary700">
      <FlashList
        data={tracks ?? []}
        renderItem={renderItem}
        extraData={trackIdsToAdd}
        keyExtractor={keyExtractor}
        onEndReachedThreshold={0.1}
        onEndReached={handleEndReached}
        estimatedItemSize={ITEM_HEIGHT}
        ItemSeparatorComponent={ItemSeparatorComponent}
        ListEmptyComponent={
          isFetching ? null : (
            <ListEmptyComponent
              isError={isError}
              isFiltered={false}
              defaultLabel="You have no saved tracks"
            />
          )
        }
        ListFooterComponent={
          isFetching && !isRefetching ? <ListFooterComponent /> : null
        }
        contentContainerStyle={{ padding: 8 }}
      />

      <AnimatePresence>
        {!!trackIdsToAdd.length && (
          <View
            position="absolute"
            bottom={24}
            w="$full"
            animation="lazy"
            enterStyle={{
              y: 100,
            }}
            exitStyle={{
              y: 100,
            }}
          >
            <XStack
              role="button"
              bg="$black"
              alignSelf="center"
              px={24}
              py={8}
              elevation={2}
              borderRadius={8}
              pressStyle={{
                bg: '$brandDark',
              }}
              onPress={() =>
                mutateAsync(
                  { trackIds: trackIdsToAdd, tagId },
                  { onSuccess: () => navigation.goBack() },
                )
              }
            >
              {isPending ? (
                <Spinner />
              ) : (
                <Text fontSize="$5" fontWeight="bold">
                  {`Add ${trackIdsToAdd.length} ${
                    trackIdsToAdd?.length > 1 ? 'tracks' : 'track'
                  }`}
                </Text>
              )}
            </XStack>
          </View>
        )}
      </AnimatePresence>
    </YStack>
  );
}
