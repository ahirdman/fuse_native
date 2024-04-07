import { useEvent, useHandler } from 'react-native-reanimated';
import { DependencyList } from 'react-native-reanimated/lib/typescript/reanimated2/hook';

// export type UseNavigationPanelProps = ReturnType<typeof useNavigationPanel>;
//
// export function useNavigationPanel(
//   onPageSelectedCallback: (position: number) => void = () => {},
// ) {
//   const ref = useRef<PagerView>(null);
//   const [activePage, setActivePage] = useState(0);
//   const [isAnimated, setIsAnimated] = useState(true);
//   const [overdragEnabled, setOverdragEnabled] = useState(false);
//   const [scrollEnabled, setScrollEnabled] = useState(true);
//   const [scrollState, setScrollState] = useState('idle');
//   const [progress, setProgress] = useState({ position: 0, offset: 0 });
//
//   const onPageScrollOffset = useSharedValue(0);
//   const onPageScrollPosition = useSharedValue(0);
//   const onPageSelectedPosition = useSharedValue(0);
//
//   const setPage = useCallback((page: number) => ref.current?.setPage(page), []);
//
//   const onPageSelected = useMemo(
//     () =>
//       Animated.event<PagerViewOnPageSelectedEventData>(
//         [{ nativeEvent: { position: onPageSelectedPosition } }],
//         {
//           listener: ({ nativeEvent: { position } }) => {
//             setActivePage(position);
//             onPageSelectedCallback(position);
//           },
//           useNativeDriver: true,
//         },
//       ),
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     [],
//   );
//
//   const onPageScrollStateChanged = useCallback(
//     (e: PageScrollStateChangedNativeEvent) => {
//       setScrollState(e.nativeEvent.pageScrollState);
//     },
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     [],
//   );
//
//   return {
//     ref,
//     activePage,
//     isAnimated,
//     scrollState,
//     scrollEnabled,
//     progress,
//     overdragEnabled,
//     setPage,
//     setProgress,
//     onPageSelected,
//     onPageScrollStateChanged,
//   };
// }

export function usePagerScrollHandler(
  // biome-ignore lint/suspicious/noExplicitAny: WIP
  handlers: any,
  dependencies?: DependencyList,
) {
  const { context, doDependenciesDiffer } = useHandler(handlers, dependencies);
  const subscribeForEvents = ['onPageScroll'];

  // biome-ignore lint/suspicious/noExplicitAny: WIP
  return useEvent<any>(
    (event) => {
      'worklet';
      const { onPageScroll } = handlers;

      if (onPageScroll && event.eventName.endsWith('onPageScroll')) {
        onPageScroll(event, context);
      }
    },
    subscribeForEvents,
    doDependenciesDiffer,
  );
}
