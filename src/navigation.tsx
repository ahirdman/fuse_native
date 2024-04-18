import { useReactNavigationDevTools } from '@dev-plugins/react-navigation';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ChevronLeft, X } from '@tamagui/lucide-icons';
import { Paragraph, Progress, XStack } from 'tamagui';

import type {
  RootStackParamList,
  RootTabParamList,
  TagListParamList,
} from 'navigation.types';
import { useAppSelector } from 'store/hooks';
import { isDefined } from 'util/assert';

import { ModalHeader } from 'components/modal-header';

import { Profile } from 'user/routes/Profile';
import { SignIn } from 'user/routes/SignIn';
import { SignUpView } from 'user/routes/SignUp';

import { TagView } from 'tag/routes/Tag';
import { TagListView } from 'tag/routes/Tags';

import { AddFuseTag } from 'fuse/routes/AddFuse';

import { CustomTabBar } from 'components/TabBar';
import { FuseListView } from 'fuse/routes/FuseList';
import { AddTag } from 'track/routes/AddTag';
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
            <RootStack.Screen name="Track" component={Track} />
            <RootStack.Screen
              name="AddFuseTag"
              component={AddFuseTag}
              options={() => {
                return {
                  presentation: 'fullScreenModal',
                  title: 'Create Fuse',
                  headerTitleStyle: { color: '#FFF' },
                  headerShown: true,
                  headerStyle: { backgroundColor: '#232323' },
                };
              }}
            />
            <RootStack.Screen
              name="AddTag"
              component={AddTag}
              options={(props) => {
                return {
                  presentation: 'modal',
                  title: 'Add Tags to track',
                  headerTitleStyle: { color: '#FFF' },
                  headerShown: true,
                  headerStyle: { backgroundColor: '#232323' },
                  headerLeft: () => (
                    <XStack onPress={() => props.navigation.goBack()}>
                      <X
                        pressStyle={{
                          color: '$border300',
                        }}
                      />
                    </XStack>
                  ),
                };
              }}
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
                      centerElement={
                        <Progress size="$2" value={progress} bg="#505050">
                          <Progress.Indicator animation="lazy" bg="#F3640B" />
                        </Progress>
                      }
                      rightElement={
                        <Paragraph
                          onPress={() => props.navigation.goBack()}
                          fontWeight="bold"
                        >
                          Cancel
                        </Paragraph>
                      }
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
        component={TagListView}
        options={{ headerShown: false }}
      />
      <TagStackNavigator.Screen
        name="Tag"
        component={TagView}
        options={(props) => {
          return {
            headerStyle: { backgroundColor: '#232323' },
            headerLeft: () => (
              <XStack onPress={() => props.navigation.goBack()}>
                <ChevronLeft />
              </XStack>
            ),
            headerTitleStyle: { color: '#FFFFFF' },
            headerTitle: 'Tag',
          };
        }}
      />
      <TagStackNavigator.Screen
        name="FuseList"
        component={FuseListView}
        options={(props) => {
          return {
            headerStyle: { backgroundColor: '#232323' },
            headerLeft: () => (
              <XStack onPress={() => props.navigation.goBack()}>
                <ChevronLeft />
              </XStack>
            ),
            headerTitleStyle: { color: '#FFFFFF' },
            headerTitle: 'Fuse List',
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
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Tracks" component={Tracks} />
      <Tab.Screen name="Lists" component={TagListStack} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

export default RootNavigationStack;
