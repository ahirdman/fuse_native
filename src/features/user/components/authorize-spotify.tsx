import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, H3, YStack } from 'tamagui';

import { Text } from 'components/Text';
import { authorizeSpotify } from 'lib/expo/expo.auth';
import { useAppDispatch } from 'store/hooks';
import { assertIsDefined } from 'util/assert';
import { showToast } from 'util/toast';

import { getSpotifyUser } from 'user/queries/getSpotifyUser';
import { upsertUserSpotifyData } from 'user/queries/updateSpotifyCredentials';
import { updateSpotifyToken, updateSpotifyUserId } from 'user/user.slice';

export function AuthorizeSpotifyPage() {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  async function handleSpotifyAuthorization() {
    try {
      const data = await authorizeSpotify();

      assertIsDefined(data?.refreshToken);

      const { accessToken, tokenType, expiresIn, scope, issuedAt } = data;

      const spotifyProfile = await getSpotifyUser(accessToken);

      await upsertUserSpotifyData({
        tokenData: { accessToken, tokenType, expiresIn, scope, issuedAt },
        refreshToken: data.refreshToken,
        spotifyUserId: spotifyProfile.id,
      });

      dispatch(updateSpotifyUserId({ id: spotifyProfile.id }));
      dispatch(
        updateSpotifyToken({
          accessToken,
          tokenType,
          expiresIn,
          scope,
          issuedAt,
        }),
      );
    } catch (_e) {
      showToast({
        preset: 'error',
        title: 'Error Authoriing Spotify',
      });
    }
  }

  return (
    <YStack
      fullscreen
      justifyContent="space-between"
      bg="$primary700"
      px={16}
      pb={insets.bottom}
    >
      <YStack gap={16} pt={16}>
        <H3 textAlign="center">Connect to Spotify</H3>
        <Text>
          In order to use FUSE, we need access to your spotify library
        </Text>
      </YStack>

      <Button
        mb={16}
        fontWeight="bold"
        bg="$brandDark"
        onPress={handleSpotifyAuthorization}
      >
        Authorize Spotify
      </Button>
    </YStack>
  );
}
