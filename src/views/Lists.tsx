import { Box, Text } from "native-base";

import Button from "@/components/atoms/Button";
import { Tables } from "@/lib/supabase/database-generated.types";
import { useLazySignOutQuery } from "@/services/supabase/auth/auth.endpoints";
import { useGetAllTagsQuery } from "@/services/supabase/tags/tags.endpoints";
import { useAppDispatch } from "@/store/hooks";
import { signOut } from "@/store/user/user.slice";
import { FlashList } from "@shopify/flash-list";

export default function Lists() {
	const [signOutQuery] = useLazySignOutQuery();
	const { data } = useGetAllTagsQuery({});

	const dispatch = useAppDispatch();

	function handleOnPress() {
		void signOutQuery();
		dispatch(signOut());
	}

	const keyExtractor = (item: Tables<"tags">) => item.id.toString();

	const renderItem = ({ item }: { item: Tables<"tags"> }) => {
		return (
			<Box h="40px" w="full" borderColor="border.400" borderWidth="1px" px="2">
				<Text>{item.name}</Text>
			</Box>
		);
	};

	return (
		<Box boxSize="full" paddingX="4" bg="primary.700" safeAreaTop>
			<Button
				mb="4"
				type="secondary"
				label="Sign out"
				onPress={handleOnPress}
			/>
			<FlashList
				data={data}
				renderItem={renderItem}
				keyExtractor={keyExtractor}
				estimatedItemSize={40}
			/>
		</Box>
	);
}
