import { Check } from '@tamagui/lucide-icons';
import { memo } from 'react';
import {
  AnimatePresence,
  Checkbox,
  type GetProps,
  XStack,
  YStack,
  styled,
} from 'tamagui';
import { TagBadge } from './TagBadge';

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
      <StyledTagRow {...props} onPress={onPress}>
        <YStack>
          <TagBadge name={name} color={color} />
        </YStack>

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
  elevation: 2,
  borderWidth: 0.5,
  bg: '$primary700',
  borderColor: '$border500',
  jc: 'space-between',
  ai: 'center',
  px: 12,
  pressStyle: {
    bg: '$primary600',
  },

  variants: {
    size: {
      small: {
        h: 40,
        borderWidth: 0,
        elevation: 0,
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
