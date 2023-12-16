import { Tables } from "@/lib/supabase/database-generated.types";
import { Box, HStack, ScrollView, Spinner, Text, VStack } from "native-base";
import type { IVStackProps } from "native-base/lib/typescript/components/primitives/Stack/VStack";
import Tag from "../atoms/Tag";
import Alert from "./Alert";

interface TagSectionProps extends IVStackProps {
	label?: string | undefined;
	emptyListLabel?: string | undefined;
	onTagPress?(tagId: number): void;
	tags?: Tables<"tags">[] | undefined;
	isLoading?: boolean | undefined;
	isError?: boolean | undefined;
}

function TagSection({
	label,
	emptyListLabel,
	onTagPress,
	tags,
	isLoading,
	isError,
	...props
}: TagSectionProps) {
	return (
		<VStack {...props} space="2" overflow="hidden" maxH="48">
			{label && (
				<HStack>
					<Text fontSize="md">{label}</Text>
				</HStack>
			)}

			<ScrollView
				contentContainerStyle={{
					flexWrap: "wrap",
					flexDirection: "row",
					rowGap: 8,
				}}
			>
				{isLoading && (
					<Box w="full" minH="20" justifyContent="center" alignItems="center">
						<Spinner color="brand.light" />
					</Box>
				)}

				{isError && (
					<Box w="full" minH="20" justifyContent="center">
						<Alert label="Error fetching tags" />
					</Box>
				)}

				{tags?.length ? (
					tags.map((tag) => (
						<Tag
							tag={tag}
							onPress={() => onTagPress?.(tag.id)}
							key={tag.id}
							mr="2"
						/>
					))
				) : (
					<Box justifyContent="center" w="full">
						<Alert variant="info" label={emptyListLabel ?? "..."} />
					</Box>
				)}
			</ScrollView>
		</VStack>
	);
}

export default TagSection;