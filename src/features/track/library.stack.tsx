import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { LibraryParamList } from 'navigation.types';
import { AvatarButton } from 'navigation/components/AvatarButton';
import { useAppSelector } from 'store/hooks';

import { selectUserId } from 'auth/auth.slice';
import { StyledImage } from 'components/Image';
import { TabHeader } from 'features/navigation/components/TabHeader';
import { useGetUser } from 'social/queries/getUser';
import { XStack } from 'tamagui';
import { Tracks } from 'track/routes/Tracks';

const LibraryNavigator = createNativeStackNavigator<LibraryParamList>();

export function LibraryStack() {
  const userId = useAppSelector(selectUserId);
  const { data } = useGetUser(userId);

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
              imageUrl={data?.avatar_url}
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
