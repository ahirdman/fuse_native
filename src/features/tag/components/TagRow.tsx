import { Check } from '@tamagui/lucide-icons';
import { memo } from 'react';
import {
  AnimatePresence,
  Checkbox,
  type GetProps,
  H5,
  Separator,
  XStack,
  styled,
} from 'tamagui';

interface TagListRowProps extends TagRowProps {
  onPress?(): void;
  color: string;
  name: string;
  selecteble?: boolean;
  isSelected?: boolean;
}

export const TagRow = memo(
  ({
    onPress,
    color,
    name,
    selecteble = false,
    isSelected = false,
    ...props
  }: TagListRowProps) => {
    return (
      <StyledTagRow {...props} onPress={onPress} justifyContent="space-between">
        <XStack alignItems="center">
          <Separator
            vertical
            borderWidth={1}
            height={16}
            borderColor={color}
            ml={16}
            mr={8}
          />
          <H5 color="white">{name}</H5>
        </XStack>

        <AnimatePresence>
          {selecteble && (
            <Checkbox
              size="$4"
              alignSelf="center"
              mr={16}
              radiused
              key={name}
              checked={isSelected}
              onPress={onPress}
              animation="quick"
              enterStyle={{
                opacity: 0,
                x: 10,
              }}
              exitStyle={{
                opacity: 0,
                x: 10,
              }}
            >
              <Checkbox.Indicator>
                <Check />
              </Checkbox.Indicator>
            </Checkbox>
          )}
        </AnimatePresence>
      </StyledTagRow>
    );
  },
);

type TagRowProps = GetProps<typeof StyledTagRow>;

const StyledTagRow = styled(XStack, {
  borderRadius: 8,
  elevation: 4,
  borderWidth: 1,
  bg: '$primary700',
  borderColor: '$border500',
  pressStyle: {
    bg: '$primary600',
  },

  variants: {
    size: {
      small: {
        h: 40,
      },
      default: {
        h: 60,
      },
    },
  } as const,

  defaultVariants: {
    size: 'default',
  },
});
