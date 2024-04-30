import { useReactNavigationDevTools } from '@dev-plugins/react-navigation';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { X } from '@tamagui/lucide-icons';
import { Paragraph, Progress, XStack } from 'tamagui';

import type {
  DrawerParamList,
  RootStackParamList,
  TabsParamList,
} from 'navigation.types';
import { useAppSelector } from 'store/hooks';
import { isDefined } from 'util/assert';

import { CustomTabBar } from 'components/TabBar';
import { Home } from 'features/dashboard/routes/Home';
import { AppDrawer } from 'features/navigation/components/Drawer';
import { FullScreenHeader } from 'features/navigation/components/FullScreenHeader';
import { ModalHeader } from 'features/navigation/components/ModalHeader';
import { SocialStack } from 'features/social/social.stack';
import { AddFuseTag } from 'fuse/routes/AddFuse';
import { TagStack } from 'tag/tag.stack';
import { LibraryStack } from 'track/library.stack';
import { AddTag } from 'track/routes/AddTag';
import { Track } from 'track/routes/Track';
import { Profile } from 'user/routes/Profile';
import { Settings } from 'user/routes/Settings';
import { SignIn } from 'user/routes/SignIn';
import { SignUpView } from 'user/routes/SignUp';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabsParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

function RootNavigationStack() {
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
            <RootStack.Screen name="Root" component={DrawerStack} />
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

function DrawerStack() {
  return (
    <Drawer.Navigator
      initialRouteName="Tabs"
      id="appDrawer"
      drawerContent={(props) => <AppDrawer {...props} />}
      screenOptions={{
        drawerActiveTintColor: '#F4753F',
        drawerInactiveTintColor: '#FFFFFF',
        headerShown: false,
        headerStyle: {
          height: 110,
        },
      }}
    >
      <Drawer.Screen
        name="Tabs"
        component={TabStack}
        options={() => {
          let swipeEnabled = true;

          const drawerSwipeEnabledScreens = [
            'Home',
            'Tags',
            'Library',
            'Social',
            'Root',
            'Friends',
            'Tracks',
            'TagList',
          ];

          if (navigationRef.isReady()) {
            swipeEnabled = drawerSwipeEnabledScreens.some(
              (tabRoute) => tabRoute === navigationRef.getCurrentRoute()?.name,
            );
          }

          return { swipeEnabled };
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: true,
          header: (props) => <FullScreenHeader {...props} />,
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: true,
          header: (props) => <FullScreenHeader {...props} />,
        }}
      />
    </Drawer.Navigator>
  );
}

function TabStack() {
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
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Tags" navigationKey="tags-tab" component={TagStack} />
      <Tab.Screen
        name="Library"
        navigationKey="libray-tab"
        component={LibraryStack}
      />
      <Tab.Screen
        name="Social"
        navigationKey="social-tab"
        component={SocialStack}
      />
    </Tab.Navigator>
  );
}

export default RootNavigationStack;
