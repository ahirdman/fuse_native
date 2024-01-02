import { useLazySignOutQuery } from "@/services/supabase/auth/auth.endpoints";
import { Button, YGroup, YStack } from "tamagui";

function Profile() {
	const [signOutQuery] = useLazySignOutQuery();

	function handleOnPress() {
		void signOutQuery();
	}

	return (
		<YStack flex={1} bg="#1C1C1C" justifyContent="center" alignItems="center">
			<YGroup width={200}>
				<YGroup.Item>
					<Button>First</Button>
				</YGroup.Item>
				<YGroup.Item>
					<Button>Second</Button>
				</YGroup.Item>
				<YGroup.Item>
					<Button onPress={handleOnPress}>signOut</Button>
				</YGroup.Item>
			</YGroup>
		</YStack>
	);
}

export default Profile;
