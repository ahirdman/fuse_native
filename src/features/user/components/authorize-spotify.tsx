import { Box, Heading, Text, VStack } from 'native-base';

import { authorizeSpotify } from 'lib/expo/expo.auth';
import { useAppDispatch } from 'store/hooks';
import { assertIsDefined } from 'util/assert';
import { showToast } from 'util/toast';

import { Button } from 'components/Button';
import { upsertUserSpotifyData } from 'user/queries';
import { useLazyGetUserProfileQuery } from 'user/queries/user.endpoint';
import { updateSpotifyToken, updateSpotifyUserId } from 'user/user.slice';

export function AuthorizeSpotifyPage() {
  const dispatch = useAppDispatch();
  const [getSpotifyUserProfile] = useLazyGetUserProfileQuery();

  async function handleSpotifyAuthorization() {
    try {
      const data = await authorizeSpotify();

      assertIsDefined(data?.refreshToken);

      const { accessToken, tokenType, expiresIn, scope, issuedAt } = data;

      const spotifyProfile = await getSpotifyUserProfile(accessToken);

      assertIsDefined(spotifyProfile.data?.id);

      await upsertUserSpotifyData({
        tokenData: { accessToken, tokenType, expiresIn, scope, issuedAt },
        refreshToken: data.refreshToken,
        spotifyUserId: spotifyProfile.data.id,
      });

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
    } catch (_e) {
      showToast({
        preset: 'error',
        title: 'Error Authoriing Spotify',
      });
    }
  }

  return (
    <Box
      flex={1}
      w="full"
      safeAreaBottom
      justifyContent="space-between"
      bg="primary.700"
      px="4"
    >
      <VStack space="4" pt="4">
        <Heading textAlign="center">Connect to Spotify</Heading>
        <Text>
          In order to use FUSE, we need access to your spotify library
        </Text>
      </VStack>

      <VStack>
        <Button
          mb="4"
          label="Authorize Spotify"
          onPress={handleSpotifyAuthorization}
        />
      </VStack>
    </Box>
  );
}
