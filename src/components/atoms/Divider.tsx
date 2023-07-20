import { Box, Divider as NativeDivider, Text } from 'native-base';

import type { IBoxProps } from 'native-base';

interface IHorizontalDividerProps extends IBoxProps {
  label?: string;
}

function HorizontalDivider({ label, ...props }: IHorizontalDividerProps) {
  return (
    <Box
      w="100%"
      flexDir="row"
      justifyContent="center"
      alignItems="center"
      {...props}
    >
      <NativeDivider w="10" mx="5" />
      {label && <Text color="singelton.lightText">{label.toUpperCase()}</Text>}
      <NativeDivider w="10" mx="5" />
    </Box>
  );
}

export default HorizontalDivider;
