import { Paragraph, Square, XStack, XStackProps } from 'tamagui';

import { hexToRGBA } from 'util/color';

interface TagListRowProps extends XStackProps {
  onPress(): void;
  tagColor: string;
  tagName: string;
}

export function TagRow({
  onPress,
  tagColor,
  tagName,
  ...props
}: TagListRowProps) {
  const backgroundColor = hexToRGBA(tagColor, 0.1);

  return (
    <XStack
      h={60}
      borderRadius={8}
      borderColor="$border400"
      borderWidth={1}
      px={8}
      elevation={4}
      bg="$primary700"
      alignItems="center"
      {...props}
      onPress={onPress}
    >
      <Square
        bg={backgroundColor}
        borderRadius={8}
        mr={16}
        h={40}
        w={40}
        borderColor={tagColor}
        borderWidth={1}
      />
      <Paragraph color="white">{tagName}</Paragraph>
    </XStack>
  );
}

export default TagRow;
