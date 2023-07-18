import { StyleSheet } from 'react-native';

import { Text } from './Themed';

import type { TextProps } from './Themed';

export function MonoText(props: TextProps) {
  return <Text {...props} style={[props.style, styles.baseText]} />;
}

const styles = StyleSheet.create({
  baseText: {
    fontFamily: 'SpaceMono',
  },
});
