import { authorizeSpotify } from '@/lib/expo/expo.auth';
import { upsertUserSpotifyData } from '@/lib/supabase/supabase.queries';
import { useLazyGetUserProfileQuery } from '@/services/spotify/user/user.endpoint';
import { useAppDispatch } from '@/store/hooks';
import {
  updateSpotifyToken,
  updateSpotifyUserId,
} from '@/store/user/user.slice';
import { assertIsDefined } from '@/util/assert';
import * as Burnt from 'burnt';
import { Box, Heading, Text, VStack } from 'native-base';
import Button from '../atoms/Button';

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
        throw new Error('Could not fetch spotify user data');
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
    } catch (_e) {
      Burnt.toast({
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
