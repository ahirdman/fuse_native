import { GetProps, Paragraph, View, styled } from 'tamagui';

import { hexToRGBA } from 'util/color';

interface TagProps extends StyledTagProps {
  name: string;
  color: string;
}

export function TagBadge({ name, color, ...props }: TagProps) {
  const badgeBackgroundColor = hexToRGBA(color, 0.1);

  return (
    <StyledTag borderColor={color} bg={badgeBackgroundColor} {...props}>
      <Paragraph color={color}>{name}</Paragraph>
    </StyledTag>
  );
}

const StyledTag = styled(View, {
  accessibilityRole: 'button',
  borderWidth: 0.5,
  borderRadius: 4,

  variants: {
    size: {
      default: {
        px: 10,
        py: 4,
      },
      small: {
        px: 8,
        py: 2,
      },
    },
  } as const,
  defaultVariants: {
    size: 'default',
  },
});

type StyledTagProps = GetProps<typeof StyledTag>;
