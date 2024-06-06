import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { DrawerScreenProps } from '@react-navigation/drawer';
import type {
  CompositeNavigationProp,
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

/*
 *  Root Stack
 * */

export type RootStackParamList = {
  Root: NavigatorScreenParams<DrawerParamList>;
  SignIn: undefined;
  SignUp: undefined;
  Track: {
    trackId: string;
  };
  AddTag: {
    trackId: string;
  };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

/*
 *  Drawer Stack
 * */

export type DrawerParamList = {
  Tabs: NavigatorScreenParams<TabsParamList>;
  Profile: { userId: string };
  Settings: undefined;
};

export type DrawerStackScreenProps<T extends keyof DrawerParamList> =
  CompositeScreenProps<
    DrawerScreenProps<DrawerParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

/*
 *  Tab Stack
 * */

export type TabsParamList = {
  Home: undefined;
  Library: NavigatorScreenParams<LibraryParamList>;
  Tags: NavigatorScreenParams<TagTabParamList>;
  Social: NavigatorScreenParams<FriendsTabParamList>;
};

export type RootTabScreenProps<T extends keyof TabsParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<TabsParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

/*
 * Library Stack
 * */

export type LibraryParamList = {
  Tracks: undefined;
};

export type LibraryTabScreenProps<T extends keyof LibraryParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<LibraryParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

interface FuseTagViewParams {
  type: 'fuse';
  id: number;
  name: string;
  tagIds: number[];
}

interface TagViewParams {
  type: 'tag';
  id: number;
  name: string;
  color: string;
}

/*
 * Social Stack
 * */

export type FriendsTabParamList = {
  Friends: undefined;
  Search: undefined;
  Profile: { userId: string };
  Tag: TagViewParams | FuseTagViewParams;
};

export type FriendsTabScreenProps<T extends keyof FriendsTabParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<FriendsTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

/*
 * Tag Stack
 * */

export type TagTabParamList = {
  TagList: undefined;
  Tag: TagViewParams | FuseTagViewParams;
};

export type TagTabScreenProps<T extends keyof TagTabParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<TagTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type TagScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<TagTabParamList, 'Tag'>,
  NativeStackNavigationProp<RootStackParamList>
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
