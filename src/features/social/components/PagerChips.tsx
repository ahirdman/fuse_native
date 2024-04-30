import { XStack, type XStackProps } from 'tamagui';

import { Text } from 'components/Text';

interface PagerChipsProps extends XStackProps {
  setPage(index: number): void;
  activePageIndex: number;
  pages: Readonly<string[]>;
}

export function PagerChips({
  pages,
  setPage,
  activePageIndex,
  ...props
}: PagerChipsProps) {
  return (
    <XStack {...props}>
      {pages.map((name, index) => (
        <XStack
          borderRadius={24}
          px={24}
          py={6}
          bg={activePageIndex === index ? '$black' : '$primary800'}
          onPress={() => setPage(index)}
          key={name}
        >
          <Text fontWeight="bold" fontSize="$5" textTransform="capitalize">
            {name}
          </Text>
        </XStack>
      ))}
    </XStack>
  );
}
