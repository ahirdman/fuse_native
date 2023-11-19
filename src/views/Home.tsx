import { Image } from 'expo-image';

import { Alert, Box, HStack, Icon, Spinner, Text, VStack } from 'native-base';
import { StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCallback, useMemo, useState } from 'react';

import InputField from '@/components/atoms/InputField';
import SecondaryButton from '@/components/atoms/SecondaryButton';
import {
  useGetUserSavedTracksQuery,
  userTracksAdapter,
  userTracksSelector,
} from '@/services/tracks/tracks.endpoints';

import type { SavedTrack, Track } from '@/services/tracks/tracks.interface';

const ITEM_HEIGHT = 40;
const TRACK_REQ_LIMIT = 50;

export default function Home() {
  const [offset, setOffset] = useState<number>(0);
  const [trackFilter, setTrackFilter] = useState<string>('');
  const {
    data: savedTracks,
    error,
    isFetching,
  } = useGetUserSavedTracksQuery(
    {
      offset,
      limit: TRACK_REQ_LIMIT,
    },
    {
      selectFromResult: ({ data, ...props }) => ({
        data: userTracksSelector.selectAll(
          data ?? userTracksAdapter.getInitialState(),
        ),
        ...props,
      }),
    },
  );

  const renderItem = useCallback(({ item }: { item: SavedTrack }) => {
    return <TrackRow track={item.track} height={ITEM_HEIGHT} />;
  }, []);

  const keyExtractor = (item: SavedTrack) => item.track.id;

  function fetchMoreTracks() {
    const newOffset = offset + TRACK_REQ_LIMIT;
    setOffset(newOffset);
  }

  interface FilterTracksArgs {
    tracks: SavedTrack[];
    filter: string;
  }

  const filterTracks = useCallback(
    ({ tracks, filter }: FilterTracksArgs): SavedTrack[] => {
      const fieldsToMatch = ['albumName', 'name', 'mainArtist'] as const;

      return tracks.filter((trackObj) =>
        fieldsToMatch.some(
          (field) =>
            trackObj.track[field]?.toLowerCase().includes(filter.toLowerCase()),
        ),
      );
    },
    [],
  );

  const data: SavedTrack[] = useMemo(
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
      {error && <Alert status="error">Error loading data</Alert>}
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

interface TrackRowProps {
  track: Track;
  height: number;
}

function TrackRow({ track, height }: TrackRowProps) {
  const rowHeight = `${height}px`;

  return (
    <HStack my="1" h={rowHeight}>
      <Box h={rowHeight} w={rowHeight} mr="2">
        <Image
          source={track.albumImageUrl}
          alt="album-image"
          accessibilityIgnoresInvertColors
          style={styles.image}
        />
      </Box>
      <VStack justifyContent="center" maxW="80%">
        <Text color="singelton.white" fontSize="sm" noOfLines={1}>
          {track.name}
        </Text>
        <HStack>
          <Text fontSize="xs" noOfLines={1}>
            {`${track.mainArtist ?? 'NA'} - ${track.albumName}`}
          </Text>
        </HStack>
      </VStack>
    </HStack>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: '100%',
  },
  flashList: {
    padding: 8,
  },
});
