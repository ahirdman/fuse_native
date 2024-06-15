import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { FriendsTabParamList } from 'navigation.types';
import { AvatarButton } from 'navigation/components/AvatarButton';
import { useAppSelector } from 'store/hooks';

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
  const { color } = getTokens();

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
        options={(props) => ({
          headerLeft: () => (
            <AvatarButton
              onPress={() => props.navigation.openDrawer()}
              imageUrl={data?.avatar_url}
            />
          ),
        })}
      />
      <SocialNav.Screen name="Search" component={SearchUsersView} />
      <SocialNav.Screen
        name="Profile"
        component={Profile}
        options={{ headerStyle: { backgroundColor: color.$brandDark.val } }}
      />
      <SocialNav.Screen name="Tag" component={TagView} />
    </SocialNav.Navigator>
  );
}
