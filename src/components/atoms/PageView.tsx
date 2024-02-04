import { Box } from 'native-base';

import type { IBoxProps } from 'native-base';

interface PageViewProps extends IBoxProps {
  children: React.ReactNode;
}

export default function PageView({ children, ...props }: PageViewProps) {
  return (
    <Box
      flex={1}
      paddingX="4"
      justifyContent="center"
      alignItems="center"
      bg="primary.700"
      {...props}
    >
      {children}
    </Box>
  );
}
