import { FlashList } from '@shopify/flash-list';
import { Search } from '@tamagui/lucide-icons';
import { useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dimensions, LayoutAnimation, RefreshControl } from 'react-native';
import { XStack, YStack } from 'tamagui';

import { useDebounce } from 'hooks/useDebounce';
import type { LibraryTabScreenProps } from 'navigation.types';

import { InputField } from 'components/InputField';
import { ListEmptyComponent } from 'components/ListEmptyComponent';
import { ListFooterComponent } from 'components/ListFooter';
import { FilterMenu } from 'track/components/Filter.menu';
import { TrackRow } from 'track/components/TrackRow';
import {
  useGetTaggedTrackIds,
  useInfiniteSavedTracks,
} from 'track/queries/getSavedTracks';
import type { SpotifyTrack } from 'track/track.interface';

const ITEM_HEIGHT = 44;
const SEPERATOR_HEIGHT = 8;
const ROW_HEIGHT = ITEM_HEIGHT + SEPERATOR_HEIGHT / 2;

export function Tracks({ navigation }: LibraryTabScreenProps<'Tracks'>) {
  const [availableRows, setAvailableRows] = useState<number>();
  const [filterTaggedTracks, setFilterTaggedTracks] = useState(false);
  const { control, watch } = useForm({
    defaultValues: {
      trackFilter: '',
    },
  });

  const formValue = watch();
  const debouncedTrackFilter = useDebounce(formValue.trackFilter, 300);
  const listRef = useRef<FlashList<SpotifyTrack> | null>(null);

  const { data: trackIds } = useGetTaggedTrackIds();
  const {
    data: tracks,
    isError,
    isFetching,
    fetchNextPage,
    refetch,
    isRefetching,
    hasNextPage,
  } = useInfiniteSavedTracks({
    searchString: debouncedTrackFilter.trim(),
    trackIds: trackIds,
    filterTaggedTracks,
  });

  function handleTrackPress(trackId: string) {
    navigation.push('Track', { trackId });
  }

  function handleEndReached() {
    if (!isFetching && hasNextPage) {
      fetchNextPage().then(({ data }) => {
        if (availableRows && data && data.length < availableRows * 2) {
          recursiveFetchMore(availableRows);
        }
      });
    }
  }

  const recursiveFetchMore = useCallback(
    (availableRows: number) => {
      fetchNextPage().then(({ hasNextPage, data }) => {
        if (hasNextPage && data && data.length < availableRows * 2) {
          recursiveFetchMore(availableRows);
        }
      });
    },
    [fetchNextPage],
  );

  const renderItem = ({ item }: { item: SpotifyTrack }) => (
    <TrackRow
      track={item}
      height={ITEM_HEIGHT}
      onPress={() => handleTrackPress(item.id)}
      isTagged={item.isTagged}
    />
  );

  const ItemSeparatorComponent = () => <YStack h={SEPERATOR_HEIGHT} />;
  const keyExtractor = (item: SpotifyTrack) => item.id;

  function handleListHeight(headerHeight: number) {
    const { height: screenHeight } = Dimensions.get('screen');

    const flastListHeight = screenHeight - headerHeight;
    const itemsVisible = flastListHeight / ROW_HEIGHT;

    setAvailableRows(itemsVisible);
  }

  function onFilterToggle() {
    setFilterTaggedTracks(!filterTaggedTracks);

    listRef.current?.prepareForLayoutAnimationRender();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }

  return (
    <YStack fullscreen bg="$primary700">
      <XStack
        bg="$primary300"
        px={8}
        borderBottomColor="$border400"
        borderWidth={0.5}
        py={8}
        onLayout={(event) => handleListHeight(event.nativeEvent.layout.height)}
        gap={8}
      >
        <FilterMenu
          filterTags={filterTaggedTracks}
          setFilterTags={onFilterToggle}
        />
        <InputField
          controlProps={{ control, name: 'trackFilter' }}
          placeholder="Search for artists or track names"
          autoCorrect={false}
          autoCapitalize="none"
          stackProps={{ flex: 3 }}
          iconLeft={<Search color="$border300" size={18} />}
        />
      </XStack>

      <FlashList
        data={tracks ?? []}
        ref={listRef}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReachedThreshold={0.1}
        onEndReached={handleEndReached}
        estimatedItemSize={ITEM_HEIGHT}
        ItemSeparatorComponent={ItemSeparatorComponent}
        ListEmptyComponent={
          isFetching ? null : (
            <ListEmptyComponent
              isError={isError}
              isFiltered={debouncedTrackFilter.length > 0}
              defaultLabel="You have no saved tracks"
            />
          )
        }
        ListFooterComponent={
          isFetching && !isRefetching ? <ListFooterComponent /> : null
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#F4753F"
          />
        }
        contentContainerStyle={{ padding: 8 }}
      />
    </YStack>
  );
}
