import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { FriendsTabParamList } from 'navigation.types';
import { AvatarButton } from 'navigation/components/AvatarButton';
import { useAppSelector } from 'store/hooks';

import { useNavigation } from '@react-navigation/native';
import { selectUserId } from 'auth/auth.slice';
import { TabHeader } from 'features/navigation/components/TabHeader';
import { Profile } from 'social/routes/Profile';
import { TagView } from 'tag/routes/Tag';
import { getTokens } from 'tamagui';
import { useGetUser } from './queries/getUser';
import { SearchUsersView } from './routes/SearchUsers';
import { Social } from './routes/social';

const SocialNav = createNativeStackNavigator<FriendsTabParamList>();

export function SocialStack() {
  const userId = useAppSelector(selectUserId);
  const { data } = useGetUser(userId);
  const navigation = useNavigation();

  return (
    <SocialNav.Navigator
      initialRouteName="Friends"
      screenOptions={{
        header: (props) => <TabHeader {...props} />,
      }}
    >
      <SocialNav.Screen
        name="Friends"
        component={Social}
        options={{
          headerLeft: () => (
            <AvatarButton
              onPress={() => navigation.navigate('Account')}
              imageUrl={data?.avatar_url}
            />
          ),
        }}
      />
      <SocialNav.Screen name="Search" component={SearchUsersView} />
      <SocialNav.Screen
        name="Profile"
        component={Profile}
        options={{
          headerTitle: () => <></>,
        }}
      />
      <SocialNav.Screen name="Tag" component={TagView} />
    </SocialNav.Navigator>
  );
}
