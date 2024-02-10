import { useReactNavigationDevTools } from '@dev-plugins/react-navigation';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ChevronLeft, Home, Tags, User } from '@tamagui/lucide-icons';
import { Progress, XStack } from 'tamagui';

import type {
  RootStackParamList,
  RootTabParamList,
  TagListParamList,
} from 'navigation.types';
import { useAppSelector } from 'store/hooks';
import { isDefined } from 'util/assert';
import { hexToRGBA } from 'util/color';

import { Button } from 'components/Button';
import { ModalHeader } from 'components/modal-header';

import { Profile } from 'user/routes/Profile';
import { SignIn } from 'user/routes/SignIn';
import { SignUpView } from 'user/routes/SignUp';

import { TagView } from 'tag/routes/Tag';
import { TagList } from 'tag/routes/Tags';

import { Track } from 'track/routes/Track';
import { Tracks } from 'track/routes/Tracks';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const TagStackNavigator = createNativeStackNavigator<TagListParamList>();

function RootNavigationStack() {
  const navigationRef = useNavigationContainerRef();

  useReactNavigationDevTools(navigationRef);
  const { user, spotifyToken, subscription } = useAppSelector(
    (state) => state.user,
  );

  const userReady =
    isDefined(user) && isDefined(spotifyToken) && isDefined(subscription);

  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {userReady ? (
          <>
            <RootStack.Screen name="Root" component={RootTabStack} />
            <RootStack.Screen
              name="Track"
              component={Track}
              options={{ presentation: 'modal' }}
            />
          </>
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
                  const progress = isDefined(subscription)
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
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
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
        component={TagView}
        options={(props) => {
          const titleColor = hexToRGBA(props.route.params.color, 0.8);

          return {
            headerStyle: { backgroundColor: '#232323' },
            headerLeft: () => (
              <XStack onPress={() => props.navigation.goBack()}>
                <ChevronLeft />
              </XStack>
            ),
            headerTitleStyle: { color: titleColor },
            headerTitle: props.route.params.name,
          };
        }}
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
        component={Tracks}
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
