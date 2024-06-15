import type {
  NavigationState,
  PartialState,
  Route,
} from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation.types';

export type ResultState = PartialState<NavigationState> & {
  state?: ResultState;
};

interface GetStateFromPathArgs {
  path: string;
}

export function getStateFromPath({ path }: GetStateFromPathArgs): {
  state: ResultState;
} {
  const url = new URL(path, 'fuse://');
  const pathName = url.pathname;

  switch (pathName) {
    case '/social': {
      const state = hydrateTabNavigationState({ bottomTabIndex: 3 });

      return { state };
    }
    default:
      throw new Error(`Received unknown URL path: ${url.href}`);
  }
}

type FlatRoute<T extends keyof RootStackParamList = keyof RootStackParamList> =
  Omit<Route<T, RootStackParamList[T]>, 'key'>;

interface HydrateTabNavigationStateArgs {
  bottomTabIndex?: number;
  deliveriesTopTabIndex?: number;
  flatRoutes?: FlatRoute[];
}

function hydrateTabNavigationState({
  bottomTabIndex = 0,
  flatRoutes,
}: HydrateTabNavigationStateArgs) {
  const navigationState = {
    routes: [
      {
        name: 'Root',
        state: {
          index: 0,
          routes: [
            {
              name: 'Tabs',
              state: {
                index: bottomTabIndex,
                routes: [
                  {
                    name: 'Home',
                  },
                  {
                    name: 'Tags',
                  },
                  {
                    name: 'Library',
                  },
                  {
                    name: 'Social',
                  },
                ],
              },
            },
            {
              name: 'Profile',
            },
            {
              name: 'Settings',
            },
          ],
        },
      },
    ],
  } satisfies ResultState;

  if (flatRoutes) {
    // HACK: Fix when navigation types have been cleaned up
    // biome-ignore lint/style/noNonNullAssertion: hacky solution until navigation tree has been fixed
    navigationState.routes[0]!.state.routes.push(...flatRoutes);
  }

  return navigationState;
}
