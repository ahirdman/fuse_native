import { Image } from "expo-image";

import { Box, HStack, Pressable, Text, VStack } from "native-base";
import { StyleSheet } from "react-native";

import type { SpotifyTrack } from "@/services/spotify/tracks/tracks.interface";
import { Feather } from "@expo/vector-icons";

interface TrackRowProps {
	onPress(): void;
	track: SpotifyTrack;
	height: number;
	tagged?: boolean;
}

function TrackRow({ track, height, onPress, tagged }: TrackRowProps) {
	const rowHeight = `${height}px`;

	return (
		<Pressable accessibilityRole="button" onPress={onPress}>
			<HStack h={rowHeight}>
				<Box h={rowHeight} w={rowHeight} mr="2">
					<Image
						source={track.albumCovers[track.albumCovers.length - 1]?.url}
						alt="album-image"
						accessibilityIgnoresInvertColors
						style={styles.image}
					/>
				</Box>

				<HStack justifyContent="space-between" alignItems="center" w="85%">
					<VStack justifyContent="center" maxW="80%">
						<Text color="singelton.white" fontSize="sm" noOfLines={1}>
							{track.name}
						</Text>

						<Text fontSize="xs" noOfLines={1}>
							{`${track.artist ?? "NA"} - ${track.albumName}`}
						</Text>
					</VStack>

					{tagged && <Feather name="tag" size={20} color="white" />}
				</HStack>
			</HStack>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	image: {
		flex: 1,
		width: "100%",
	},
});

export default TrackRow;
