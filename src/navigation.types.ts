import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type {
	CompositeScreenProps,
	NavigatorScreenParams,
} from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { UserTracksReq } from "./services/spotify/tracks/tracks.interface";

export type RootStackParamList = {
	SignIn: undefined;
	SignUp: undefined;
	ResetPassword: undefined;
	Root: NavigatorScreenParams<RootTabParamList>;
	Track: {
		trackId: string;
		originalArgs: UserTracksReq;
	};
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
	NativeStackScreenProps<RootStackParamList, T>;

export type RootTabParamList = {
	Tracks: undefined;
	Lists: undefined;
	Profile: undefined;
};

export type RootTabScreenProps<T extends keyof RootTabParamList> =
	CompositeScreenProps<
		BottomTabScreenProps<RootTabParamList, T>,
		RootStackScreenProps<keyof RootStackParamList>
	>;

declare global {
	namespace ReactNavigation {
		interface RootParamList extends RootStackParamList {}
	}
}
