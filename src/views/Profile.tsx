import Button from "@/components/atoms/Button";
import PageView from "@/components/atoms/PageView";
import { useLazySignOutQuery } from "@/services/supabase/auth/auth.endpoints";
import { useAppDispatch } from "@/store/hooks";
import { signOut } from "@/store/user/user.slice";

function Profile() {
	const [signOutQuery] = useLazySignOutQuery();
	const dispatch = useAppDispatch();

	function handleOnPress() {
		void signOutQuery();
		dispatch(signOut());
	}

	return (
		<PageView>
			<Button
				mb="4"
				type="secondary"
				label="Sign out"
				onPress={handleOnPress}
			/>
		</PageView>
	);
}

export default Profile;
