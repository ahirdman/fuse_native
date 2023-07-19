import { View } from 'native-base';

interface PageViewProps {
  children: React.ReactNode;
}

export default function PageView({ children }: PageViewProps) {
  return (
    <View
      flex={1}
      paddingX="4"
      justifyContent="center"
      alignItems="center"
      backgroundColor="primary.500"
    >
      {children}
    </View>
  );
}
