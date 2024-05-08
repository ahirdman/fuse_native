import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, H3, Spinner, View, YStack } from 'tamagui';

import { Text } from 'components/Text';

import { useSignUp } from 'auth/proivders/signUp.provider';
import { useAuthorizeSpotify } from 'auth/queries/authorizeSpotify';
import { StyledImage } from 'components/Image';

export function AuthorizeSpotifyPage() {
  const { dispatch, nextPage } = useSignUp();
  const { mutateAsync, isPending } = useAuthorizeSpotify();

  const insets = useSafeAreaInsets();

  async function onAuthorize() {
    await mutateAsync(undefined, {
      onSuccess: ({ spotifyToken, spotifyUser }) => {
        dispatch({
          type: 'submitSpotifyToken',
          payload: { spotifyUser, spotifyToken },
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
      pt={24}
      pb={insets.bottom}
      px={24}
    >
      <YStack>
        <H3>Connect to Spotify</H3>
        <Text>
          In order to use FUSE, we need access to your spotify library
        </Text>
      </YStack>

      <StyledImage
        source={require('../../../../assets/icons/Spotify_Icon_White.png')}
        flex={1}
        contentFit="contain"
        mx={48}
      />

      <Button
        fontWeight="bold"
        fontSize="$5"
        mb={16}
        bg="$brandDark"
        onPress={onAuthorize}
      >
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
