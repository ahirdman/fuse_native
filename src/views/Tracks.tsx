import { Alert, Box, Icon, Spinner } from 'native-base';
import { StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCallback, useMemo, useState } from 'react';

import InputField from '@Atoms/InputField';
import SecondaryButton from '@Atoms/SecondaryButton';
import { useGetUserSavedTracksQuery } from '@/services/tracks/tracks.endpoints';
import TrackRow from '@Molecules/TrackRow';

import type { RootTabScreenProps } from '@/navigation.types';
import type { SpotifyTrack } from '@/services/tracks/tracks.interface';

const ITEM_HEIGHT = 40;
const TRACK_REQ_LIMIT = 50;

function Tracks({ navigation }: RootTabScreenProps<'Tracks'>) {
  const [offset, setOffset] = useState<number>(0);
  const [trackFilter, setTrackFilter] = useState<string>('');

  const reqArgs = {
    offset,
    limit: TRACK_REQ_LIMIT,
  };

  const {
    data: savedTracks = [],
    error,
    isFetching,
  } = useGetUserSavedTracksQuery(reqArgs);

  function handleTrackPress(trackId: string) {
    navigation.push('Track', {
      trackId,
      originalArgs: reqArgs,
    });
  }

  const renderItem = ({ item }: { item: SpotifyTrack }) => {
    return (
      <TrackRow
        track={item}
        height={ITEM_HEIGHT}
        onPress={() => handleTrackPress(item.id)}
      />
    );
  };

  const keyExtractor = (item: SpotifyTrack) => item.id;

  function fetchMoreTracks() {
    const newOffset = offset + TRACK_REQ_LIMIT;
    setOffset(newOffset);
  }

  interface FilterTracksArgs {
    tracks: SpotifyTrack[];
    filter: string;
  }

  const filterTracks = useCallback(
    ({ tracks, filter }: FilterTracksArgs): SpotifyTrack[] => {
      const fieldsToMatch = ['albumName', 'name', 'artist'] as const;

      return tracks.filter((trackObj) =>
        fieldsToMatch.some(
          (field) =>
            trackObj[field]?.toLowerCase().includes(filter.toLowerCase()),
        ),
      );
    },
    [],
  );

  const data: SpotifyTrack[] = useMemo(
    () => filterTracks({ tracks: savedTracks, filter: trackFilter }),
    [savedTracks, trackFilter, filterTracks],
  );

  function ListFooterComponent() {
    return (
      <Box w="full" h="10">
        {isFetching && <Spinner color="white" />}
      </Box>
    );
  }

  return (
    <Box flex={1} background="primary.700">
      <Box
        w="full"
        justifyContent="space-between"
        alignItems="center"
        bg="primary.300"
        px="2"
        safeAreaTop
        flexDir="row"
        borderBottomColor="border.400"
        borderWidth="0.5"
      >
        <InputField
          placeholder="Search for artists or track names"
          w="72"
          size="md"
          rounded="6"
          InputLeftElement={<Icon as={<Ionicons name="search" />} ml="3" />}
          value={trackFilter}
          setValue={setTrackFilter}
        />
        <SecondaryButton label="Filter" w="20" onPress={() => {}} />
      </Box>
      {error && (
        <Alert status="error" bg="error.500">
          Error loading data
        </Alert>
      )}
      <FlashList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={fetchMoreTracks}
        onEndReachedThreshold={0.3}
        ListFooterComponent={ListFooterComponent}
        estimatedItemSize={ITEM_HEIGHT}
        contentContainerStyle={styles.flashList}
      />
    </Box>
  );
}

const styles = StyleSheet.create({
  flashList: {
    padding: 8,
  },
});

export default Tracks;
