import { View } from 'native-base';

import type { IViewProps } from 'native-base/lib/typescript/components/basic/View/types';

interface PageViewProps extends IViewProps {
  children: React.ReactNode;
}

export default function PageView({ children, ...props }: PageViewProps) {
  return (
    <View
      flex={1}
      paddingX="4"
      justifyContent="center"
      alignItems="center"
      backgroundColor="primary.700"
      {...props}
    >
      {children}
    </View>
  );
}
