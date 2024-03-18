import { FlashList } from '@shopify/flash-list';
import { useForm } from 'react-hook-form';
import { RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spinner, XStack, YStack } from 'tamagui';

import { Alert } from 'components/Alert';
import { Button } from 'components/Button';
import { InputField } from 'components/InputField';
import { useDebounce } from 'hooks/useDebounce';
import type { RootTabScreenProps } from 'navigation.types';

import { Search } from '@tamagui/lucide-icons';
import TrackRow from 'track/components/TrackRow';
import { useInfiniteSavedTracks } from 'track/queries/getSavedTracks';
import { SpotifyTrack } from 'track/track.interface';

export function Tracks({ navigation }: RootTabScreenProps<'Tracks'>) {
  const { control, watch } = useForm({
    defaultValues: {
      trackFilter: '',
    },
  });

  const formValue = watch();
  const debouncedTrackFilter = useDebounce(formValue.trackFilter, 300);
  const insets = useSafeAreaInsets();
  const {
    data: tracks,
    isError,
    isFetching,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useInfiniteSavedTracks(debouncedTrackFilter);

  function handleTrackPress(trackId: string) {
    navigation.push('Track', { trackId });
  }

  function handleEndReached() {
    if (!isFetching) {
      fetchNextPage();
    }
  }

  function handleRefetch() {
    refetch();
  }

  const renderItem = ({ item }: { item: SpotifyTrack }) => (
    <TrackRow
      track={item}
      height={40}
      onPress={() => handleTrackPress(item.id)}
    />
  );

  const ItemSeparatorComponent = () => <YStack h={8} />;
  const keyExtractor = (item: SpotifyTrack) => item.id;

  return (
    <YStack fullscreen bg="$primary700">
      <XStack
        bg="$primary300"
        borderBottomColor="$border400"
        p={8}
        pt={insets.top}
        borderWidth={0.5}
        gap={16}
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
        <Button type="secondary" label="Filter" flex={1} onPress={() => {}} />
      </XStack>

      <FlashList
        data={tracks ?? []}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReachedThreshold={0.3}
        onEndReached={handleEndReached}
        estimatedItemSize={40}
        ItemSeparatorComponent={ItemSeparatorComponent}
        ListEmptyComponent={
          isFetching ? null : <ListEmptyComponent isError={isError} />
        }
        ListFooterComponent={isFetching ? <ListFooterComponent /> : null}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefetch}
            tintColor="#F3640B"
          />
        }
        contentContainerStyle={{ padding: 4 }}
      />
    </YStack>
  );
}

function ListEmptyComponent({ isError }: { isError: boolean }) {
  return (
    <YStack p={16}>
      {isError ? (
        <Alert label="Error fetching tracks" />
      ) : (
        <Alert label="You have no saved tracks" variant="info" />
      )}
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
