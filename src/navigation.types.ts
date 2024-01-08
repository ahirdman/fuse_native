import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type {
	CompositeScreenProps,
	NavigatorScreenParams,
} from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { UserTracksReq } from "./services/spotify/tracks/tracks.interface";

/*
 *  Root Stack
 * */

export type RootStackParamList = {
	SignIn: undefined;
	SignUp: undefined;
	ResetPassword: undefined;
	Root: NavigatorScreenParams<RootTabParamList>;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
	NativeStackScreenProps<RootStackParamList, T>;

/*
 *  Tab Navigator Root
 * */

export type RootTabParamList = {
	Tracks: undefined;
	Lists: NavigatorScreenParams<TagListParamList>;
	Profile: undefined;
};

export type RootTabScreenProps<T extends keyof RootTabParamList> =
	CompositeScreenProps<
		BottomTabScreenProps<RootTabParamList, T>,
		RootStackScreenProps<keyof RootStackParamList>
	>;

/*
 * Track List Navigatior Stack
 * */

export type TrackListParamList = {
	TrackList: undefined;
	Track: {
		trackId: string;
		originalArgs: UserTracksReq;
	};
};

export type TrackListScreenProps<T extends keyof TrackListParamList> =
	CompositeScreenProps<
		NativeStackScreenProps<TrackListParamList, T>,
		RootTabScreenProps<keyof RootTabParamList>
	>;

/*
 * Tag List Navigatior Stack
 * */

export type TagListParamList = {
	TagList: undefined;
	Tag: {
		id: number;
		name: string;
	};
};

export type TagListScreenProps<T extends keyof TagListParamList> =
	CompositeScreenProps<
		NativeStackScreenProps<TagListParamList, T>,
		RootTabScreenProps<keyof RootTabParamList>
	>;

declare global {
	namespace ReactNavigation {
		interface RootParamList extends RootStackParamList {}
	}
}
