import React, {
  type ReactNode,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import { TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  type SharedValue,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedView } from 'primitives/AnimatedView';

interface BottomSheetProps {
  children: ReactNode;
}

interface BottomSheetMethods {
  expand: () => void;
  close: () => void;
}

const BottomSheet = forwardRef<BottomSheetMethods, BottomSheetProps>(
  ({ children }, ref) => {
    const [bottomSheetHeight, setBottomSheetHeight] = useState(1000);
    const { width } = useWindowDimensions();
    const insets = useSafeAreaInsets();

    const openHeight = 0;
    const closeHeight = bottomSheetHeight + insets.bottom;

    const translateY = useSharedValue(closeHeight);

    const expand = useCallback(() => {
      translateY.value = withTiming(openHeight);
    }, [translateY]);

    const close = useCallback(() => {
      translateY.value = withTiming(closeHeight);
    }, [closeHeight, translateY]);

    useImperativeHandle(
      ref,
      () => ({
        expand,
        close,
      }),
      [expand, close],
    );

    const animationStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateY: translateY.value }],
      };
    });

    const pan = Gesture.Pan()
      .onUpdate((event) => {
        if (event.translationY < 0) {
          translateY.value = withSpring(openHeight, {
            damping: 200,
            stiffness: 800,
          });
        } else {
          translateY.value = withSpring(event.translationY, {
            damping: 100,
            stiffness: 400,
          });
        }
      })
      .onEnd(() => {
        if (translateY.value > 50) {
          translateY.value = withSpring(closeHeight, {
            damping: 100,
            stiffness: 400,
          });
        } else {
          translateY.value = withSpring(openHeight, {
            damping: 100,
            stiffness: 400,
          });
        }
      });

    return (
      <>
        <BackDrop
          close={close}
          translateY={translateY}
          openHeight={openHeight}
          closeHeight={closeHeight}
        />
        <GestureDetector gesture={pan}>
          <AnimatedView
            position="absolute"
            py={40}
            px={20}
            bg="$black"
            borderRadius={30}
            jc="center"
            ai="center"
            alignSelf="center"
            style={[
              {
                width: width * 0.92,
                bottom: insets.bottom,
              },
              animationStyle,
            ]}
            onLayout={({ nativeEvent }) => {
              const { height } = nativeEvent.layout;
              if (height) {
                setBottomSheetHeight(height);
                translateY.value = withTiming(height + insets.bottom);
              }
            }}
          >
            <AnimatedView
              position="absolute"
              top={8}
              width={40}
              height={4}
              borderRadius={8}
              bg="$border500"
            />
            {children}
          </AnimatedView>
        </GestureDetector>
      </>
    );
  },
);

type BackDropProps = {
  translateY: SharedValue<number>;
  openHeight: number;
  closeHeight: number;
  close: () => void;
};

function BackDrop({
  translateY,
  openHeight,
  closeHeight,
  close,
}: BackDropProps) {
  const backDropAnimation = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [closeHeight, openHeight],
      [0, 0.5],
    );
    const display = opacity === 0 ? 'none' : 'flex';

    return {
      opacity,
      display,
    };
  });

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        close();
      }}
    >
      <AnimatedView
        display="none"
        bg="black"
        position="absolute"
        top={0}
        left={0}
        bottom={0}
        right={0}
        style={backDropAnimation}
      />
    </TouchableWithoutFeedback>
  );
}

export { BottomSheet, type BottomSheetMethods };
