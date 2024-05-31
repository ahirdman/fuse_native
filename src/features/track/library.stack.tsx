import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { LibraryParamList } from 'navigation.types';
import { AvatarButton } from 'navigation/components/AvatarButton';
import { useAppSelector } from 'store/hooks';

import { StyledImage } from 'components/Image';
import { TabHeader } from 'features/navigation/components/TabHeader';
import { useGetAvatarUrl } from 'social/queries/getSignedAvatarUrl';
import { XStack } from 'tamagui';
import { Tracks } from 'track/routes/Tracks';

const LibraryNavigator = createNativeStackNavigator<LibraryParamList>();

export function LibraryStack() {
  const avatarUrl = useAppSelector((state) => state.auth.profile?.avatarUrl);
  const userAvatar = useGetAvatarUrl(avatarUrl);

  return (
    <LibraryNavigator.Navigator
      screenOptions={{
        header: (props) => <TabHeader {...props} />,
      }}
    >
      <LibraryNavigator.Screen
        name="Tracks"
        component={Tracks}
        options={(props) => ({
          headerLeft: () => (
            <AvatarButton
              onPress={() => props.navigation.openDrawer()}
              imageUrl={userAvatar.data}
            />
          ),
          headerTitle: () => (
            <XStack>
              <StyledImage
                source={require('../../../assets/icons/Spotify_Logo_White.png')}
                h={30}
                width="$full"
                contentFit="contain"
              />
            </XStack>
          ),
        })}
      />
    </LibraryNavigator.Navigator>
  );
}
