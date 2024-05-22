import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { FriendsTabParamList } from 'navigation.types';
import { AvatarButton } from 'navigation/components/AvatarButton';
import { useAppSelector } from 'store/hooks';

import { TabHeader } from 'features/navigation/components/TabHeader';
import { Profile } from 'social/routes/Profile';
import { useGetAvatarUrl } from './queries/getSignedAvatarUrl';
import { SearchUsersView } from './routes/SearchUsers';
import { Social } from './routes/social';

const SocialNav = createNativeStackNavigator<FriendsTabParamList>();

export function SocialStack() {
  const avatarUrl = useAppSelector((state) => state.auth.profile?.avatarUrl);
  const userAvatar = useGetAvatarUrl(avatarUrl);

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
              imageUrl={userAvatar.data}
            />
          ),
        })}
      />
      <SocialNav.Screen name="Search" component={SearchUsersView} />
      <SocialNav.Screen name="Profile" component={Profile} />
    </SocialNav.Navigator>
  );
}
