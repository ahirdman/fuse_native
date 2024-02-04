import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, Tags, User } from '@tamagui/lucide-icons';

import { isDefined } from '@/util/assert';
import ScreenHeader from './components/molecules/ScreenHeader';
import ResetPassword from './routes/ResetPassword';
import SignIn from './routes/SignIn';
import SignUpView from './routes/SignUp';
import Track from './routes/Track';
import Tracks from './routes/Tracks';
import { useAppSelector } from './store/hooks';

import { Progress } from 'tamagui';
import Button from './components/atoms/Button';
import { ModalHeader } from './components/organisms/modal-header';
import {
  type RootStackParamList,
  type RootTabParamList,
  TagListParamList,
  TrackListParamList,
} from './navigation.types';
import Profile from './routes/Profile';
import Tag from './routes/Tag';
import TagList from './routes/Tags';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const TrackStackNavigator = createNativeStackNavigator<TrackListParamList>();
const TagStackNavigator = createNativeStackNavigator<TagListParamList>();

function RootNavigationStack() {
  const { user, spotifyToken, appSubscription } = useAppSelector(
    (state) => state.user,
  );

  const userReady =
    isDefined(user) && isDefined(spotifyToken) && isDefined(appSubscription);

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {userReady ? (
          <RootStack.Screen name="Root" component={RootTabStack} />
        ) : (
          <>
            <RootStack.Screen
              name="SignIn"
              component={SignIn}
              options={{ animationTypeForReplace: 'pop' }}
            />
            <RootStack.Screen
              name="SignUp"
              component={SignUpView}
              options={{
                presentation: 'modal',
                headerShown: true,
                header: (props) => {
                  const progress = isDefined(appSubscription)
                    ? 100
                    : spotifyToken
                      ? 66
                      : user
                        ? 33
                        : 0;

                  return (
                    <ModalHeader
                      centerElement={() => (
                        <Progress size="$2" value={progress} bg="#505050">
                          <Progress.Indicator animation="lazy" bg="#F3640B" />
                        </Progress>
                      )}
                      rightElement={() => (
                        <Button
                          type="teritary"
                          label="Cancel"
                          onPress={() => props.navigation.goBack()}
                        />
                      )}
                      {...props}
                    />
                  );
                },
              }}
            />
            <RootStack.Screen
              name="ResetPassword"
              component={ResetPassword}
              options={{
                presentation: 'modal',
              }}
            />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

function TrackListStack() {
  return (
    <TrackStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <TrackStackNavigator.Screen name="TrackList" component={Tracks} />
      <TrackStackNavigator.Screen
        name="Track"
        component={Track}
        options={{ presentation: 'modal' }}
      />
    </TrackStackNavigator.Navigator>
  );
}

function TagListStack() {
  return (
    <TagStackNavigator.Navigator>
      <TagStackNavigator.Screen
        name="TagList"
        component={TagList}
        options={{ headerShown: false }}
      />
      <TagStackNavigator.Screen
        name="Tag"
        component={Tag}
        options={({ route }) => ({
          header: (props) => (
            <ScreenHeader {...props} title={route.params.name} />
          ),
        })}
      />
    </TagStackNavigator.Navigator>
  );
}

function RootTabStack() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#FFFFFF',
        headerShown: false,
        tabBarStyle: { backgroundColor: 'black', borderTopWidth: 0 },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Tracks"
        component={TrackListStack}
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home color={color} />,
        }}
      />
      <Tab.Screen
        name="Lists"
        component={TagListStack}
        options={{
          title: 'Lists',
          tabBarIcon: ({ color }) => <Tags color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default RootNavigationStack;
