import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, H3, Spinner, View, YStack } from 'tamagui';

import { Text } from 'components/Text';

import { useSignUp } from 'auth/proivders/signUp.provider';
import { useAuthorizeSpotify } from 'auth/queries/authorizeSpotify';

export function AuthorizeSpotifyPage() {
  const { dispatch, nextPage } = useSignUp();
  const { mutateAsync, isPending } = useAuthorizeSpotify();
  const insets = useSafeAreaInsets();

  async function onAuthorize() {
    await mutateAsync(undefined, {
      onSuccess: (data) => {
        dispatch({
          type: 'submitSpotifyToken',
          payload: {
            spotifyUserId: data.id,
            tokenData: {
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              expiresIn: data.expiresIn,
              issuedAt: data.issuedAt,
            },
          },
        });

        nextPage();
      },
    });
  }

  return (
    <View
      key="authorize-spotify"
      w="$full"
      h="$full"
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

      <Button mb={16} fontWeight="bold" bg="$brandDark" onPress={onAuthorize}>
        {isPending && (
          <Button.Icon>
            <Spinner />
          </Button.Icon>
        )}
        Authorize Spotify
      </Button>
    </View>
  );
}
