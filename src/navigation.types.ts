import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type {
	CompositeScreenProps,
	NavigatorScreenParams,
} from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { UserTracksReq } from 'track/tracks.interface';

/*
 *  Root Stack
 * */

export type RootStackParamList = {
	SignIn: undefined;
	SignUp: undefined;
	Root: NavigatorScreenParams<RootTabParamList>;
	Track: {
		trackId: string;
		originalArgs: UserTracksReq;
	};
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
	NativeStackScreenProps<RootStackParamList, T>;

/*
 *  Tab Navigator Root
 * */

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

/*
 * Tag List Navigatior Stack
 * */

export type TagListParamList = {
	TagList: undefined;
	Tag: {
		id: number;
		name: string;
		color: string;
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
