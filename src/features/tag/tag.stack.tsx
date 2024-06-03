import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { TagTabParamList } from 'navigation.types';

import { selectUserId } from 'auth/auth.slice';
import { TabHeader } from 'features/navigation/components/TabHeader';
import { AvatarButton } from 'navigation/components/AvatarButton';
import { useGetUser } from 'social/queries/getUser';
import { useAppSelector } from 'store/hooks';
import { TagView } from 'tag/routes/Tag';
import { TagListView } from 'tag/routes/Tags';

const TagStackNavigator = createNativeStackNavigator<TagTabParamList>();

export function TagStack() {
  const userId = useAppSelector(selectUserId);
  const { data } = useGetUser(userId);

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
              imageUrl={data?.avatar_url}
            />
          ),
        })}
      />
      <TagStackNavigator.Screen name="Tag" component={TagView} />
    </TagStackNavigator.Navigator>
  );
}
