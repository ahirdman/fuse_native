import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { StyleSheet } from "react-native";

import { supabase } from "./lib/supabase/supabase.init";
import { selectUserData } from "./lib/supabase/supabase.queries";
import { isBoolean } from "./lib/util/assert";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { setSubscription, setToken, signIn } from "./store/user/user.slice";
import Lists from "./views/Lists";
import ResetPassword from "./views/ResetPassword";
import SignIn from "./views/SignIn";
import SignUpView from "./views/SignUp";
import Track from "./views/Track";
import Tracks from "./views/Tracks";

import type { RootStackParamList, RootTabParamList } from "./navigation.types";
import type { SpotifyToken } from "./store/user/user.interface";

interface TabBarIconProps {
	name: React.ComponentProps<typeof Ionicons>["name"];
	color: string;
}

function TabBarIcon({ name, color }: TabBarIconProps) {
	return (
		<Ionicons size={28} style={styles.tabBarIcon} color={color} name={name} />
	);
}

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

// TODO: TrackView

function RootNavigationStack() {
	const dispatch = useAppDispatch();
	const { user, token } = useAppSelector((state) => state.user);

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
				{user && token ? (
					<>
						<RootStack.Screen name="Root" component={RootTabStack} />
						<RootStack.Screen
							name="Track"
							component={Track}
							options={{ presentation: "modal" }}
						/>
					</>
				) : (
					<>
						<RootStack.Screen
							name="SignIn"
							component={SignIn}
							options={{ animationTypeForReplace: "pop" }}
						/>
						<RootStack.Screen
							name="SignUp"
							component={SignUpView}
							options={{ presentation: "modal" }}
						/>
						<RootStack.Screen
							name="ResetPassword"
							component={ResetPassword}
							options={{ presentation: "modal" }}
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
				tabBarActiveTintColor: "white",
				headerShown: false,
				tabBarStyle: { backgroundColor: "black" },
			}}
		>
			<Tab.Screen
				name="Tracks"
				component={Tracks}
				options={{
					title: "Home",
					tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
				}}
			/>
			<Tab.Screen
				name="Lists"
				component={Lists}
				options={{
					title: "Lists",
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
