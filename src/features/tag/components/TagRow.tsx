import { Check } from '@tamagui/lucide-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import {
  AnimatePresence,
  Checkbox,
  type GetProps,
  Text,
  XStack,
  styled,
} from 'tamagui';

interface TagListRowProps extends TagRowProps {
  onPress?(): void;
  color: string | string[];
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
    const gradientColors = Array.isArray(color) ? color : [color, color];
    const textColor = Array.isArray(color) ? 'white' : color;

    return (
      <StyledTagRow {...props} onPress={onPress}>
        <XStack gap={12} ai="center">
          <LinearGradient
            colors={gradientColors}
            style={{ width: 18, height: 18, borderRadius: 100 }}
          />
          <Text color={textColor}>{name}</Text>
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

export const StyledTagRow = styled(XStack, {
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
