import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TabHeader } from 'features/navigation/components/TabHeader';
import type { LibraryParamList } from 'navigation.types';
import { AvatarButton } from 'navigation/components/AvatarButton';
import { Tracks } from './routes/Tracks';

const LibraryNavigator = createNativeStackNavigator<LibraryParamList>();

export function LibraryStack() {
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
            <AvatarButton onPress={() => props.navigation.openDrawer()} />
          ),
        })}
      />
    </LibraryNavigator.Navigator>
  );
}
