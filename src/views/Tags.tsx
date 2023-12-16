import { Box, Icon } from "native-base";

import InputField from "@/components/atoms/InputField";
import TagRow from "@/components/molecules/TagRow";
import useDebounce from "@/hooks/useDebounce";
import { Tables } from "@/lib/supabase/database-generated.types";
import { useGetAllTagsQuery } from "@/services/supabase/tags/tags.endpoints";
import { TagsWithTrackIdsQuery } from "@/services/supabase/tags/tags.interface";
import { Feather } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useCallback, useMemo, useState } from "react";
import { RefreshControl, StyleSheet } from "react-native";

interface FilterTagsArgs {
	tags: TagsWithTrackIdsQuery[];
	filter: string;
}

export default function TagList() {
	const { data, refetch, isFetching } = useGetAllTagsQuery({});
	const [tagFilter, setTagFilter] = useState<string>("");
	const debouncedTrackFilter = useDebounce(tagFilter, 300);

	function handleRefetch() {
		void refetch();
	}

	const filterTags = useCallback(
		({ tags, filter }: FilterTagsArgs): TagsWithTrackIdsQuery[] => {
			const fieldsToMatch = ["name"] as const;

			const res = tags.filter((tag) =>
				fieldsToMatch.some((field) =>
					tag[field]?.toLowerCase().includes(filter),
				),
			);

			return res;
		},
		[],
	);

	const tags: TagsWithTrackIdsQuery[] = useMemo(() => {
		return !debouncedTrackFilter.length
			? data ?? []
			: filterTags({
					tags: data ?? [],
					filter: debouncedTrackFilter.toLowerCase(),
			  });
	}, [data, debouncedTrackFilter, filterTags]);

	const keyExtractor = (item: Tables<"tags">) => item.id.toString();

	const renderItem = ({ item }: { item: Tables<"tags"> }) => {
		return <TagRow tag={item} />;
	};

	const ItemSeparatorComponent = () => <Box h="2" />;

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
					placeholder="Search for tags"
					w="full"
					size="md"
					rounded="6"
					autoCorrect={false}
					autoCapitalize="none"
					InputLeftElement={<Icon as={<Feather name="search" />} ml="3" />}
					value={tagFilter}
					onChangeText={setTagFilter}
				/>
			</Box>

			<FlashList
				data={tags}
				renderItem={renderItem}
				keyExtractor={keyExtractor}
				estimatedItemSize={40}
				ItemSeparatorComponent={ItemSeparatorComponent}
				contentContainerStyle={styles.flashList}
				refreshControl={
					<RefreshControl
						refreshing={isFetching}
						onRefresh={handleRefetch}
						tintColor="#F07123"
					/>
				}
			/>
		</Box>
	);
}

const styles = StyleSheet.create({
	flashList: {
		padding: 8,
	},
});
