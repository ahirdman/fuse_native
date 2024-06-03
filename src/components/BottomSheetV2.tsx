import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { type ReactNode, forwardRef, useCallback, useMemo } from 'react';
import { StyleSheet, type ViewProps } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

interface DetachedModalProps extends ViewProps {
  children: ReactNode;
  snapPoints?:
    | (string | number)[]
    | SharedValue<(string | number)[]>
    | Readonly<(string | number)[] | SharedValue<(string | number)[]>>
    | undefined;
}

export const DetachedModal = forwardRef<BottomSheetModal, DetachedModalProps>(
  ({ children, snapPoints, ...props }, ref) => {
    const baseSnapPoints = useMemo(() => {
      if (snapPoints) {
        return snapPoints;
      }

      return ['40%'];
    }, [snapPoints]);

    const handleSheetChanges = useCallback((index: number) => {
      console.log('handleSheetChanges', index);
    }, []);

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
      <BottomSheetModal
        ref={ref}
        index={0}
        bottomInset={46}
        detached={true}
        onChange={handleSheetChanges}
        snapPoints={baseSnapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={[styles.background, props.style]}
        handleStyle={[styles.handle, props.style]}
        handleIndicatorStyle={styles.handleIndicator}
        style={styles.modal}
      >
        <BottomSheetView style={styles.sheetView}>{children}</BottomSheetView>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  sheetView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modal: {
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
