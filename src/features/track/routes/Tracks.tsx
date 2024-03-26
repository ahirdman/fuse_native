import { FlashList } from '@shopify/flash-list';
import { useForm } from 'react-hook-form';
import { Dimensions, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spinner, XStack, YStack } from 'tamagui';

import { Alert } from 'components/Alert';
import { InputField } from 'components/InputField';
import { useDebounce } from 'hooks/useDebounce';
import type { RootTabScreenProps } from 'navigation.types';

import { Search } from '@tamagui/lucide-icons';
import { useCallback, useState } from 'react';
import { FilterMenu } from 'track/components/Filter.menu';
import TrackRow from 'track/components/TrackRow';
import {
  useGetTaggedTrackIds,
  useInfiniteSavedTracks,
} from 'track/queries/getSavedTracks';
import { SpotifyTrack } from 'track/track.interface';

const ITEM_HEIGHT = 44;
const SEPERATOR_HEIGHT = 8;

const ROW_HEIGHT = ITEM_HEIGHT + SEPERATOR_HEIGHT / 2;

export function Tracks({ navigation }: RootTabScreenProps<'Tracks'>) {
  const [availableRows, setAvailableRows] = useState<number>();
  const [filterTaggedTracks, setFilterTaggedTracks] = useState(false);
  const { control, watch } = useForm({
    defaultValues: {
      trackFilter: '',
    },
  });

  const formValue = watch();
  const debouncedTrackFilter = useDebounce(formValue.trackFilter, 300);
  const insets = useSafeAreaInsets();

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: cant depend on itself dummy
  const recursiveFetchMore = useCallback(
    (availableRows: number) => {
      fetchNextPage().then(({ hasNextPage, data }) => {
        if (hasNextPage && data && data.length < availableRows * 2) {
          recursiveFetchMore(availableRows);
        }
      });
    },
    [fetchNextPage, debouncedTrackFilter],
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

  return (
    <YStack fullscreen bg="$primary700">
      <XStack
        bg="$primary300"
        borderBottomColor="$border400"
        p={8}
        pt={insets.top}
        borderWidth={0.5}
        gap={16}
        onLayout={(event) => handleListHeight(event.nativeEvent.layout.height)}
      >
        <InputField
          controlProps={{ control, name: 'trackFilter' }}
          placeholder="Search for artists or track names"
          size="md"
          rounded="6"
          autoCorrect={false}
          autoCapitalize="none"
          _stack={{ flex: 3 }}
          InputLeftElement={<Search ml={12} size={16} color="$border300" />}
        />
        <FilterMenu
          filterTags={filterTaggedTracks}
          setFilterTags={setFilterTaggedTracks}
        />
      </XStack>

      <FlashList
        data={tracks ?? []}
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
        contentContainerStyle={{ padding: 4 }}
      />
    </YStack>
  );
}

function ListEmptyComponent({
  isError,
  isFiltered,
}: { isError: boolean; isFiltered: boolean }) {
  const alertLabel = isError
    ? 'Error fetching tracks'
    : isFiltered
      ? 'No matches'
      : 'You have no saved tracks';

  return (
    <YStack p={16}>
      <Alert label={alertLabel} variant={isError ? 'error' : 'info'} />
    </YStack>
  );
}

function ListFooterComponent() {
  return (
    <YStack h={40} justifyContent="center" alignItems="center">
      <Spinner />
    </YStack>
  );
}
