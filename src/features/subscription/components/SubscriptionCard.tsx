import { Card, type CardProps, H4, Paragraph } from 'tamagui';

interface SubscriptionCardProps extends CardProps {
  onPress(): void;
  active: boolean;
  title: string;
  price: string;
}

export function SubscriptionCard({
  onPress,
  active,
  title,
  price,
  ...props
}: SubscriptionCardProps) {
  return (
    <Card
      elevate
      bg="$background"
      borderColor={active ? '#F59E0B' : '#505050'}
      borderWidth={0.5}
      onPress={onPress}
      pressStyle={{ scale: 0.95 }}
      animation="bouncy"
      padded
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      {...props}
    >
      <H4 color="#EDEDED" textTransform="capitalize">
        {title}
      </H4>
      <Paragraph color="#EDEDED">{price}</Paragraph>
    </Card>
  );
}
