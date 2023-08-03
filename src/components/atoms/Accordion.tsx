import { Pressable } from 'native-base';
import { useCallback, useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

interface IAccordionProps {
  initial: 'COLLAPSED' | 'EXPANDED';
  collapsedHeight: number;
  expandedHeight: number;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  index: number;
  activeAccordion: number | null;
}

function Accordion({
  style,
  children,
  collapsedHeight,
  expandedHeight,
  initial,
  index,
  activeAccordion,
}: IAccordionProps) {
  const animationRef = useRef(
    new Animated.Value(
      initial === 'COLLAPSED' ? collapsedHeight : expandedHeight,
    ),
  ).current;

  function onPress() {
    // isCollapsed ? handleExpand() : handleCollapse();
    //
    // if (index !== activeAccordion) {
    //   setActiveAccordion(index);
    // }
    //
    // setIsCollapsed(!isCollapsed);
  }

  const handleCollapse = useCallback(() => {
    Animated.spring(animationRef, {
      toValue: collapsedHeight,
      bounciness: 0,
      useNativeDriver: false,
    }).start();
  }, [animationRef, collapsedHeight]);

  const handleExpand = useCallback(() => {
    Animated.spring(animationRef, {
      toValue: expandedHeight,
      bounciness: 0,
      useNativeDriver: false,
    }).start();
  }, [animationRef, expandedHeight]);

  useEffect(() => {
    activeAccordion !== index ? handleCollapse() : handleExpand();
  }, [activeAccordion, handleCollapse, handleExpand, index]);

  return (
    <Animated.View
      style={[{ height: animationRef }, styles.animatedView, style]}
    >
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        width="100%"
        padding="4"
        justifyContent="flex-start"
        alignItems="center"
        height="100%"
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animatedView: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#505050',
    backgroundColor: '#1C1C1C',
    borderRadius: 15,
    overflow: 'hidden',
  },
});

export default Accordion;
