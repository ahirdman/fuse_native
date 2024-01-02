import { authorizeSpotify } from "@/lib/expo/expo.auth";
import { upsertUserSpotifyData } from "@/lib/supabase/supabase.queries";
import { assertIsDefined } from "@/lib/util/assert";
import { useLazyGetUserProfileQuery } from "@/services/spotify/user/user.endpoint";
import { useAppDispatch } from "@/store/hooks";
import {
	updateSpotifyToken,
	updateSpotifyUserId,
} from "@/store/user/user.slice";
import { Heading, Text } from "native-base";
import Button from "../atoms/Button";
import { SignUpTemplate } from "../templates/signup.template";

export function AuthorizeSpotifyPage() {
	const dispatch = useAppDispatch();
	const [getSpotifyUserProfile] = useLazyGetUserProfileQuery();

	async function handleSpotifyAuthorization() {
		try {
			const data = await authorizeSpotify();

			assertIsDefined(data?.refreshToken);

			const { accessToken, tokenType, expiresIn, scope, issuedAt } = data;

			await upsertUserSpotifyData({
				tokenData: { accessToken, tokenType, expiresIn, scope, issuedAt },
				refreshToken: data.refreshToken,
			});

			const spotifyProfile = await getSpotifyUserProfile(accessToken);

			if (spotifyProfile.error || !spotifyProfile.data) {
				throw new Error("Could not fetch spotify user data");
			}

			dispatch(updateSpotifyUserId({ id: spotifyProfile.data.id }));

			dispatch(
				updateSpotifyToken({
					accessToken,
					tokenType,
					expiresIn,
					scope,
					issuedAt,
				}),
			);
		} catch (err) {
			console.log(err);
		}
	}
	return (
		<SignUpTemplate
			renderBody={() => (
				<>
					<Heading textAlign="center">Connect to Spotify</Heading>
					<Text>
						In order to use FUSE, we need access to your spotify library
					</Text>
				</>
			)}
			renderFooter={() => (
				<Button
					w="full"
					label="Authorize Spotify"
					onPress={handleSpotifyAuthorization}
				/>
			)}
		/>
	);
}
