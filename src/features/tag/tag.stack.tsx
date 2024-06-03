import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { TagTabParamList } from 'navigation.types';

import { TabHeader } from 'features/navigation/components/TabHeader';
import { AvatarButton } from 'navigation/components/AvatarButton';
import { useGetAvatarUrl } from 'social/queries/getSignedAvatarUrl';
import { useAppSelector } from 'store/hooks';
import { TagView } from 'tag/routes/Tag';
import { TagListView } from 'tag/routes/Tags';

const TagStackNavigator = createNativeStackNavigator<TagTabParamList>();

export function TagStack() {
  const avatarUrl = useAppSelector((state) => state.auth.profile?.avatarUrl);
  const userAvatar = useGetAvatarUrl(avatarUrl);

  return (
    <TagStackNavigator.Navigator
      screenOptions={{ header: (props) => <TabHeader {...props} /> }}
    >
      <TagStackNavigator.Screen
        name="TagList"
        component={TagListView}
        options={(props) => ({
          headerTitle: 'Tag',
          headerLeft: () => (
            <AvatarButton
              onPress={() => props.navigation.openDrawer()}
              imageUrl={userAvatar.data}
            />
          ),
        })}
      />
      <TagStackNavigator.Screen name="Tag" component={TagView} />
    </TagStackNavigator.Navigator>
  );
}
