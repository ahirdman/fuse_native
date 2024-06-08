import BottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { type ReactNode, forwardRef, useCallback } from 'react';
import { StyleSheet, type ViewProps } from 'react-native';

interface DetachedBottomSheetProps extends ViewProps {
  children: ReactNode;
}

export const DetachedBottomSheet = forwardRef<
  BottomSheet,
  DetachedBottomSheetProps
>(({ children, ...props }, ref) => {
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        style={styles.backdrop}
        {...props}
      />
    ),
    [],
  );

  return (
    <BottomSheet
      ref={ref}
      index={0}
      bottomInset={46}
      detached={true}
      enableDynamicSizing={true}
      backdropComponent={renderBackdrop}
      backgroundStyle={[styles.background, props.style]}
      handleStyle={[styles.handle, props.style]}
      handleIndicatorStyle={styles.handleIndicator}
      style={styles.bottomSheet}
    >
      <BottomSheetView style={styles.sheetView}>{children}</BottomSheetView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  sheetView: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  bottomSheet: {
    marginHorizontal: 24,
  },
  handleIndicator: {
    backgroundColor: '#505050',
  },
  handle: {
    backgroundColor: '#1C1C1C',
    borderRadius: 30,
  },
  background: {
    backgroundColor: '#1C1C1C',
  },
  backdrop: {
    opacity: 0,
  },
});
