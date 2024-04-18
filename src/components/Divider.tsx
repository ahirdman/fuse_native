import { Paragraph, Separator, XStack, XStackProps } from 'tamagui';

interface IHorizontalDividerProps extends XStackProps {
  label?: string;
}

export function HorizontalDivider({
  label,
  ...props
}: IHorizontalDividerProps) {
  return (
    <XStack w="100%" alignItems="center" gap={16} {...props}>
      <Separator borderWidth={1} />
      <Paragraph color="white" fontWeight="bold">
        {label}
      </Paragraph>
      <Separator borderWidth={1} />
    </XStack>
  );
}
