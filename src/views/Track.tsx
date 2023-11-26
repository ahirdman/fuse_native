import { Image } from "expo-image";

import { Feather } from "@expo/vector-icons";
import { Alert, Box, Icon, Pressable, VStack } from "native-base";
import { StyleSheet } from "react-native";

import PageView from "@/components/atoms/PageView";
import { useGetUserSavedTracksQuery } from "@/services/spotify/tracks/tracks.endpoints";
import {
	useDeleteTagFromTrackMutation,
	useGetTagsForTrackQuery,
} from "@/services/supabase/tags/tags.endpoints";

import TagSection from "@/components/molecules/TagSection";
import TrackDetails from "@/components/molecules/TrackDetails";
import TagFormFooter from "@/components/organisms/tag-form-footer";
import type { RootStackScreenProps } from "@/navigation.types";

function Track({ route, navigation }: RootStackScreenProps<"Track">) {
	const {
		params: { originalArgs, trackId },
	} = route;
	const { data: userSavedTrack } = useGetUserSavedTracksQuery(
		{
			...originalArgs,
		},
		{
			selectFromResult: ({ data, ...props }) => ({
				data: data?.find((track) => track.id === trackId),
				...props,
			}),
		},
	);

	const {
		data: trackTags,
		isFetching: trackTagsLoading,
		isError: trackTagsError,
	} = useGetTagsForTrackQuery({
		trackId,
	});

	const [deleteTag] = useDeleteTagFromTrackMutation();

	if (!userSavedTrack) {
		return (
			<PageView>
				<Alert />
			</PageView>
		);
	}

	function handleTrackTagPress(tagId: number) {
		void deleteTag({ tagId });
	}

	function handleClosePress() {
		navigation.goBack();
	}

	const [albumCover] = userSavedTrack.albumCovers;

	return (
		<Box bg="primary.700" boxSize="full">
			<Box position="relative" borderBottomWidth="1" borderColor="border.500">
				<Pressable
					accessibilityRole="button"
					position="absolute"
					zIndex={1}
					right="2"
					top="2"
					onPress={handleClosePress}
				>
					{({ isPressed }) => (
						<Box rounded="full" bg="rgba(187, 187, 187, 0.5)" p="1">
							<Icon
								as={<Feather name="x" />}
								size="lg"
								color={isPressed ? "border.500" : "primary.700"}
							/>
						</Box>
					)}
				</Pressable>
				<Image
					source={albumCover?.url}
					alt="album-image"
					accessibilityIgnoresInvertColors
					style={styles.albumImage}
				/>
			</Box>

			<TrackDetails track={userSavedTrack} px="4" pt="4" />

			<VStack
				px="4"
				mt="4"
				mb="12"
				justifyContent="space-between"
				space="2"
				flex={1}
			>
				<TagSection
					label="Track Tags"
					tags={trackTags}
					isLoading={trackTagsLoading}
					isError={trackTagsError}
					onTagPress={handleTrackTagPress}
				/>

				<TagFormFooter track={userSavedTrack} />
			</VStack>
		</Box>
	);
}

const styles = StyleSheet.create({
	albumImage: {
		width: "100%",
		height: 320,
	},
});

export default Track;
