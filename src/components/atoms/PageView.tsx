import { View } from 'native-base';

interface PageViewProps {
  children: JSX.Element | JSX.Element[];
}

export default function PageView({ children }: PageViewProps) {
  return (
    <View
      flex={1}
      justifyContent="center"
      alignItems="center"
      backgroundColor="primary.500"
    >
      {children}
    </View>
  );
}
