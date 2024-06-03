import { type GetProps, Paragraph, View, styled } from 'tamagui';

import { hexToRGBA } from 'util/color';

type TagColor =
  | { type: 'tag'; color: string }
  | { type: 'fuse'; colors: string[] };

interface TagProps extends StyledTagProps {
  name: string;
  color: TagColor;
}

export function TagBadge({ name, color, ...props }: TagProps) {
  let backgroundColor;
  let fontColor;

  if (color.type === 'tag') {
    fontColor = color.color;
    backgroundColor = hexToRGBA(color.color, 0.1);
  }

  if (color.type === 'fuse') {
    //TODO: Parse better
    fontColor = color.colors[0]!;
    backgroundColor = hexToRGBA(color.colors[0]!, 0.1);
  }

  return (
    <StyledTag bg={backgroundColor} {...props}>
      <Paragraph fontWeight="bold" color={fontColor}>
        {name}
      </Paragraph>
    </StyledTag>
  );
}

const StyledTag = styled(View, {
  accessibilityRole: 'button',
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
