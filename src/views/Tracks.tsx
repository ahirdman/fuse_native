import Ionicons from "@expo/vector-icons/Ionicons";
import { Box, Icon, ScrollView } from "native-base";
import { useCallback, useMemo, useState } from "react";

import Button from "@/components/atoms/Button";
import { useGetUserSavedTracksQuery } from "@/services/spotify/tracks/tracks.endpoints";
import InputField from "@Atoms/InputField";

import Alert from "@/components/molecules/Alert";
import TracksList from "@/components/organisms/TrackList";
import useDebounce from "@/hooks/useDebounce";
import type { RootTabScreenProps } from "@/navigation.types";
import type { SpotifyTrack } from "@/services/spotify/tracks/tracks.interface";
import { RefreshControl } from "react-native";

interface FilterTracksArgs {
	tracks: SpotifyTrack[];
	filter: string;
}

const TRACK_REQ_LIMIT = 50;

function Tracks({ navigation }: RootTabScreenProps<"Tracks">) {
	const [offset, setOffset] = useState<number>(0);
	const [trackFilter, setTrackFilter] = useState<string>("");
	const debouncedTrackFilter = useDebounce(trackFilter, 300);

	const reqArgs = useMemo(
		() => ({
			offset,
			limit: TRACK_REQ_LIMIT,
		}),
		[offset],
	);

	const { data, error, isFetching, refetch, isLoading } =
		useGetUserSavedTracksQuery(reqArgs);

	const filterTracks = useCallback(
		({ tracks, filter }: FilterTracksArgs): SpotifyTrack[] => {
			const fieldsToMatch = ["albumName", "name", "artist"] as const;

			const res = tracks.filter((trackObj) =>
				fieldsToMatch.some((field) =>
					trackObj[field]?.toLowerCase().includes(filter),
				),
			);

			return res;
		},
		[],
	);

	const tracks: SpotifyTrack[] = useMemo(() => {
		return !debouncedTrackFilter.length
			? data?.items ?? []
			: filterTracks({
					tracks: data?.items ?? [],
					filter: debouncedTrackFilter.toLowerCase(),
			  });
	}, [data?.items, debouncedTrackFilter, filterTracks]);

	function handleTrackPress(trackId: string) {
		navigation.push("Track", {
			trackId,
			originalArgs: reqArgs,
		});
	}

	function handleEndReached() {
		if (data && data.items.length < data.total) {
			const newOffset = offset + TRACK_REQ_LIMIT;
			setOffset(newOffset);
		}
	}

	function handleRefetch() {
		void refetch();
	}

	return (
		<Box flex={1} background="primary.700">
			<Box
				w="full"
				justifyContent="space-between"
				alignItems="center"
				bg="primary.300"
				p="2"
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
					autoCorrect={false}
					autoCapitalize="none"
					InputLeftElement={<Icon as={<Ionicons name="search" />} ml="3" />}
					value={trackFilter}
					onChangeText={setTrackFilter}
				/>
				<Button type="secondary" label="Filter" w="20" onPress={() => {}} />
			</Box>

			{error && (
				<ScrollView
					bg="primary.700"
					h="full"
					p="4"
					refreshControl={
						<RefreshControl
							refreshing={isFetching}
							onRefresh={handleRefetch}
							tintColor="#F07123"
						/>
					}
				>
					<Alert label="Error fetching tracks" />
				</ScrollView>
			)}

			<TracksList
				tracks={tracks}
				isRefreshing={isLoading}
				onTrackPress={handleTrackPress}
				onEndReached={handleEndReached}
				onRefetch={handleRefetch}
			/>
		</Box>
	);
}

export default Tracks;
