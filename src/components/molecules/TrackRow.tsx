import { Image } from "expo-image";

import { Box, HStack, Pressable, Text, VStack } from "native-base";
import { StyleSheet } from "react-native";

import type { SpotifyTrack } from "@/services/spotify/tracks/tracks.interface";

interface TrackRowProps {
	onPress(): void;
	track: SpotifyTrack;
	height: number;
}

function TrackRow({ track, height, onPress }: TrackRowProps) {
	const rowHeight = `${height}px`;

	return (
		<Pressable accessibilityRole="button" onPress={onPress}>
			<HStack my="1" h={rowHeight}>
				<Box h={rowHeight} w={rowHeight} mr="2">
					<Image
						source={track.albumCovers[track.albumCovers.length - 1]?.url}
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
							{`${track.artist ?? "NA"} - ${track.albumName}`}
						</Text>
					</HStack>
				</VStack>
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
