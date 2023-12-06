import { assertIsDefined } from "@/lib/util/assert";
import { SpotifyTrack } from "@/services/spotify/tracks/tracks.interface";
import {
	useAddTagToTrackMutation,
	useCreateTagMutation,
	useGetAllTagsQuery,
} from "@/services/supabase/tags/tags.endpoints";
import * as Burnt from "burnt";
import { HStack, VStack } from "native-base";
import { IVStackProps } from "native-base/lib/typescript/components/primitives/Stack/VStack";
import { useState } from "react";
import { returnedResults } from "reanimated-color-picker";
import Button from "../atoms/Button";
import IconButton from "../atoms/IconButton";
import InputField from "../atoms/InputField";
import ColorPickerModal from "../molecules/ColorPickerModal";
import TagSection from "../molecules/TagSection";

interface CreateTagFormProps extends IVStackProps {
	track: Pick<SpotifyTrack, "name" | "artist" | "id">;
}

function TagFormFooter({ track, ...props }: CreateTagFormProps) {
	const [tagName, setTagName] = useState("");
	const [tagColor, setTagColor] = useState("#FFFFFF");
	const [showModal, setShowModal] = useState(false);
	const [tagAddView, setTagAddView] = useState<"new" | "existing">("new");

	const [tagTrack, { isLoading }] = useCreateTagMutation();
	const [addTagToTrack] = useAddTagToTrackMutation();
	const { data } = useGetAllTagsQuery({ exclude: { trackId: track.id } });

	async function handlePress() {
		assertIsDefined(tagColor);

		const result = await tagTrack({
			color: tagColor,
			name: tagName,
			track,
		});

		if ("error" in result) {
			Burnt.toast({
				title: "Something went wrong",
				preset: "error",
				message: "Could not create tag",
			});
		}

		setTagName("");
	}

	function onSelectColor(colors: returnedResults) {
		setTagColor(colors.hex);
	}

	async function handleTagPress(tagId: number) {
		const result = await addTagToTrack({ tagId, track });

		if ("error" in result) {
			Burnt.toast({
				title: "Something went wrong",
				preset: "error",
				message: "Could not add tag to track",
			});
		}
	}

	return (
		<VStack {...props}>
			<HStack justifyContent="space-between" alignItems="baseline">
				<Button
					type="teritary"
					label="Create new tag"
					_text={{
						color: tagAddView === "new" ? "white" : "border.400",
					}}
					onPress={() => setTagAddView("new")}
				/>
				<Button
					type="teritary"
					label="Add existing tag"
					_text={{
						color: tagAddView === "existing" ? "white" : "border.400",
					}}
					onPress={() => setTagAddView("existing")}
				/>
			</HStack>

			<VStack space="2" minH="24">
				{tagAddView === "new" && (
					<>
						<HStack justifyContent="space-between">
							<InputField
								value={tagName}
								onChangeText={setTagName}
								placeholder="Name"
								w="87%" //TODO: Fix
							/>
							<IconButton color={tagColor} onPress={() => setShowModal(true)} />
						</HStack>

						<Button
							type="secondary"
							label="Create New Tag"
							onPress={handlePress}
							isLoading={isLoading}
						/>
						<ColorPickerModal
							isVisible={showModal}
							onComplete={onSelectColor}
							setIsVisible={setShowModal}
						/>
					</>
				)}
				{tagAddView === "existing" && (
					<TagSection
						tags={data}
						onTagPress={handleTagPress}
						emptyListLabel="All tags added to track"
					/>
				)}
			</VStack>
		</VStack>
	);
}

export default TagFormFooter;
