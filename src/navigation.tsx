import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect } from 'react';

import Home from './views/Home';
import { useAppDispatch, useAppSelector } from './store/hooks';
import SignIn from './views/SignIn';
import SignUpView from './views/SignUp';
import Lists from './views/Lists';
import ResetPassword from './views/ResetPassword';
import { supabase } from './lib/supabase/supabase.init';
import { selectUserData } from './lib/supabase/supabase.queries';
import { setSubscription, setToken, signIn } from './store/user/user.slice';
import { isBoolean } from './lib/util/assert';

import type { RootStackParamList } from './navigation.types';
import type { SpotifyToken } from './store/user/user.interface';

interface TabBarIconProps {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}

function TabBarIcon({ name, color }: TabBarIconProps) {
  return (
    <Ionicons size={28} style={styles.tabBarIcon} color={color} name={name} />
  );
}

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// TODO: TrackView

function RootNavigationStack() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_, newSession) => {
        const userData = await selectUserData();

        if (userData && isBoolean(userData.is_subscribed)) {
          dispatch(setSubscription({ subscribed: userData.is_subscribed }));
        }

        if (userData?.spotify_token_data) {
          const data = userData.spotify_token_data as SpotifyToken;
          dispatch(setToken({ ...data }));
        }

        if (newSession?.user.id) {
          dispatch(signIn({ id: newSession.user.id }));
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [dispatch]);

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <RootStack.Screen name="Main" component={RootTabStack} />
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
              options={{ presentation: 'modal' }}
            />
            <RootStack.Screen
              name="ResetPassword"
              component={ResetPassword}
              options={{ presentation: 'modal' }}
            />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

function RootTabStack() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'white',
        headerShown: false,
        tabBarStyle: { backgroundColor: 'black' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tab.Screen
        name="Lists"
        component={Lists}
        options={{
          title: 'Lists',
          tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarIcon: {
    marginBottom: -3,
  },
});

export default RootNavigationStack;
