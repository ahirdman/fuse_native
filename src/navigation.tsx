import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";

import ScreenHeader from "./components/molecules/ScreenHeader";
import { isBoolean, isDefined } from "./lib/util/assert";
import { useAppSelector } from "./store/hooks";
import ResetPassword from "./views/ResetPassword";
import SignIn from "./views/SignIn";
import SignUpView from "./views/SignUp";
import Track from "./views/Track";
import Tracks from "./views/Tracks";

import { Feather } from "@expo/vector-icons";
import { Progress } from "tamagui";
import Button from "./components/atoms/Button";
import { ModalHeader } from "./components/organisms/modal-header";
import {
	type RootStackParamList,
	type RootTabParamList,
	TagListParamList,
} from "./navigation.types";
import Profile from "./views/Profile";
import Tag from "./views/Tag";
import TagList from "./views/Tags";

interface TabBarIconProps {
	name: React.ComponentProps<typeof Feather>["name"];
	color: string;
}

function TabBarIcon({ name, color }: TabBarIconProps) {
	return (
		<Feather size={28} style={styles.tabBarIcon} color={color} name={name} />
	);
}

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();
const TagListStack = createNativeStackNavigator<TagListParamList>();

// TODO: TrackView

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
							options={{
								presentation: "modal",
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
								presentation: "modal",
							}}
						/>
					</>
				)}
			</RootStack.Navigator>
		</NavigationContainer>
	);
}

function TagListStackScreen() {
	return (
		<TagListStack.Navigator>
			<TagListStack.Screen
				name="TagList"
				component={TagList}
				options={{ headerShown: false }}
			/>
			<TagListStack.Screen
				name="Tag"
				component={Tag}
				options={({ route }) => ({
					header: (props) => (
						<ScreenHeader {...props} title={route.params.name} />
					),
				})}
			/>
		</TagListStack.Navigator>
	);
}

function RootTabStack() {
	return (
		<Tab.Navigator
			screenOptions={{
				tabBarActiveTintColor: "white",
				headerShown: false,
				tabBarStyle: { backgroundColor: "black" },
				tabBarShowLabel: false,
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
				component={TagListStackScreen}
				options={{
					title: "Lists",
					tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
				}}
			/>
			<Tab.Screen
				name="Profile"
				component={Profile}
				options={{
					title: "Profile",
					tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
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
