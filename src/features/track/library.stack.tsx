import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { LibraryParamList } from 'navigation.types';
import { AvatarButton } from 'navigation/components/AvatarButton';
import { useAppSelector } from 'store/hooks';

import { useNavigation } from '@react-navigation/native';
import { selectUserId } from 'auth/auth.slice';
import { StyledImage } from 'components/Image';
import { TabHeader } from 'features/navigation/components/TabHeader';
import { useGetUser } from 'social/queries/getUser';
import { Tracks } from 'track/routes/Tracks';

const LibraryNavigator = createNativeStackNavigator<LibraryParamList>();

export function LibraryStack() {
  const userId = useAppSelector(selectUserId);
  const { data } = useGetUser(userId);
  const navigation = useNavigation();

  return (
    <LibraryNavigator.Navigator
      screenOptions={{
        header: (props) => <TabHeader {...props} />,
      }}
    >
      <LibraryNavigator.Screen
        name="Tracks"
        component={Tracks}
        options={{
          headerLeft: () => (
            <AvatarButton
              onPress={() => navigation.navigate('Account')}
              imageUrl={data?.avatar_url}
            />
          ),
          headerTitle: () => (
            <StyledImage
              source={require('../../../assets/icons/Spotify_Logo_White.png')}
              h={30}
              width="$full"
              contentFit="contain"
            />
          ),
        }}
      />
    </LibraryNavigator.Navigator>
  );
}
