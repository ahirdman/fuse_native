import Ionicons from '@expo/vector-icons/Ionicons';
import { Box, HStack, Icon, Text } from 'native-base';

interface AccordionHeaderProps {
  label: string;
  iconRight: boolean;
}

function AccordionHeader({ label, iconRight }: AccordionHeaderProps) {
  return (
    <HStack
      justifyContent="space-between"
      alignItems="center"
      w="100%"
      h="100%"
    >
      <Box minW="4">
        <Text fontWeight="bold" fontSize="md">
          {label}
        </Text>
      </Box>
      <Box minW="4">
        {iconRight && (
          <Icon
            as={<Ionicons name="ios-checkmark-circle-outline" />}
            size={6}
            color="success.500"
          />
        )}
      </Box>
    </HStack>
  );
}

export default AccordionHeader;
