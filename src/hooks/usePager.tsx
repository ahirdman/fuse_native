import { useCallback, useMemo, useRef, useState } from 'react';
import type { NativeSyntheticEvent } from 'react-native';
import type PagerView from 'react-native-pager-view';

function usePager() {
  const [currentPageIndex, setActivePageIndex] = useState(0);
  const ref = useRef<PagerView>(null);

  const nextPage = useCallback(
    () => ref.current?.setPage(currentPageIndex + 1),
    [currentPageIndex],
  );

  const setPage = useCallback((page: number) => ref.current?.setPage(page), []);

  const onPageSelected = useMemo(
    () => (e: NativeSyntheticEvent<Readonly<{ position: number }>>) => {
      setActivePageIndex(e.nativeEvent.position);
    },
    [],
  );

  return { setPage, nextPage, ref, onPageSelected, currentPageIndex };
}

type UsePagerResult = ReturnType<typeof usePager>;

export { usePager, type UsePagerResult };
