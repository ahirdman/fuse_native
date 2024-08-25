import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { X } from '@tamagui/lucide-icons';
import * as Linking from 'expo-linking';
import { addNotificationResponseReceivedListener } from 'expo-notifications';
import { XStack } from 'tamagui';

import type { RootStackParamList, TabsParamList } from 'navigation.types';
import { useAppSelector } from 'store/hooks';
import { isDefined } from 'util/assert';

import { SignIn } from 'auth/routes/SignIn';
import { SignUpView } from 'auth/routes/SignUp';
import { CustomTabBar } from 'components/TabBar';
import { Account } from 'features/account/routes/Account';
import { SocialStack } from 'features/social/social.stack';
import { useNotifications } from 'hooks/useNotifications';
import { getStateFromPath } from 'navigation/linking.state';
import { Profile } from 'social/routes/Profile';
import { TagStack } from 'tag/tag.stack';
import { LibraryStack } from 'track/library.stack';
import { AddTag } from 'track/routes/AddTag';
import { AddTracks } from 'track/routes/AddTracks';
import { Track } from 'track/routes/Track';
import { Settings } from 'user/routes/Settings';
import { showToast } from 'util/toast';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabsParamList>();

export const navigationRef = createNavigationContainerRef<RootStackParamList>();
const prefix = Linking.createURL('/');

function RootNavigationStack() {
  const { user, spotifyToken, subscription } = useAppSelector(
    (state) => state.auth,
  );

  const userReady =
    isDefined(user) && isDefined(spotifyToken) && isDefined(subscription);

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={{
        prefixes: [prefix],
        getStateFromPath: (path) => {
          try {
            if (!userReady) {
              throw new Error('Cannot route without an active user');
            }

            const { state } = getStateFromPath({ path });

            return state;
          } catch (_error) {
            showToast({
              title: 'Could not navigate',
              preset: 'error',
            });
          }
        },
        subscribe(listener) {
          const notificationSubscription =
            addNotificationResponseReceivedListener((response) => {
              listener(response.notification.request.content.data.url);
            });

          const linkingSubscription = Linking.addEventListener(
            'url',
            ({ url }) => {
              listener(url);
            },
          );

          return () => {
            notificationSubscription.remove();
            linkingSubscription.remove();
          };
        },
      }}
    >
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {userReady ? (
          <>
            <RootStack.Screen name="Root" component={TabStack} />
            <RootStack.Screen name="Track" component={Track} />
            <RootStack.Screen
              name="AddTracks"
              component={AddTracks}
              options={(props) => {
                return {
                  presentation: 'modal',
                  title: 'Add Tracks',
                  headerTitleStyle: { color: '#FFF' },
                  headerShown: true,
                  headerStyle: { backgroundColor: '#232323' },
                  headerLeft: () => (
                    <XStack onPress={() => props.navigation.goBack()}>
                      <X
                        color="$white"
                        pressStyle={{
                          color: '$border300',
                        }}
                      />
                    </XStack>
                  ),
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
                        color="$white"
                        pressStyle={{
                          color: '$border300',
                        }}
                      />
                    </XStack>
                  ),
                };
              }}
            />
            <RootStack.Screen
              name="Account"
              component={Account}
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
            <RootStack.Screen name="SignUp" component={SignUpView} />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
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
