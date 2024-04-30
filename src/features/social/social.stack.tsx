import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TabHeader } from 'features/navigation/components/TabHeader';
import type { FriendsTabParamList } from 'navigation.types';
import { AvatarButton } from 'navigation/components/AvatarButton';
import { Profile } from 'user/routes/Profile';
import { SearchUsersView } from './routes/SearchUsers';
import { Social } from './routes/social';

const SocialNav = createNativeStackNavigator<FriendsTabParamList>();

export function SocialStack() {
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
            <AvatarButton onPress={() => props.navigation.openDrawer()} />
          ),
        })}
      />
      <SocialNav.Screen name="Search" component={SearchUsersView} />
      <SocialNav.Screen name="Profile" component={Profile} />
    </SocialNav.Navigator>
  );
}
