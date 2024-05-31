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
      {pages.map((name, index) => {
        const isActivePage = activePageIndex === index;

        return (
          <XStack
            borderRadius={8}
            py={6}
            f={1}
            jc="center"
            bg={isActivePage ? '$primary800' : '$colorTransparent'}
            borderColor="$border500"
            borderWidth={isActivePage ? 0.5 : 0}
            onPress={() => setPage(index)}
            key={name}
          >
            <Text
              fontWeight="bold"
              fontSize="$5"
              textTransform="capitalize"
              color={isActivePage ? '$white' : '$border300'}
            >
              {name}
            </Text>
          </XStack>
        );
      })}
    </XStack>
  );
}
