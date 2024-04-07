import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type {
	CompositeScreenProps,
	NavigatorScreenParams,
} from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

/*
 *  Root Stack
 * */

export type RootStackParamList = {
	Root: NavigatorScreenParams<RootTabParamList>;
	SignIn: undefined;
	SignUp: undefined;
	Track: {
		trackId: string;
	};
	AddTag: {
		trackId: string;
	};
	AddFuseTag: undefined;
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
 * Tag List Navigatior Stack
 * */

export type TagListParamList = {
	TagList: undefined;
	Tag: {
		id: number;
		name: string;
		color: string;
	};
	FuseList: {
		id: number;
		name: string;
	};
};

export type TagListScreenProps<T extends keyof TagListParamList> =
	CompositeScreenProps<
		NativeStackScreenProps<TagListParamList, T>,
		RootStackScreenProps<keyof RootStackParamList>
	>;

declare global {
	namespace ReactNavigation {
		interface RootParamList extends RootStackParamList {}
	}
}
