import { Card, H2, H3, Paragraph, XStack } from "tamagui";

interface SubscriptionCardProps {
	onPress(): void;
	active: boolean;
	title: string;
	body: string;
	price: number;
}

export function SubscriptionCard({
	onPress,
	active,
	title,
	body,
	price,
}: SubscriptionCardProps) {
	return (
		<Card
			elevate
			bg="$background"
			h="$11"
			borderColor={active ? "#F59E0B" : "#505050"}
			borderWidth={0.5}
			onPress={onPress}
			pressStyle={{ scale: 0.95 }}
			animation="bouncy"
		>
			<Card.Header padded>
				<H2 color="#EDEDED">{title}</H2>
				<Paragraph color="#BBBBBB">{body}</Paragraph>
			</Card.Header>
			<Card.Footer padded>
				<XStack flex={1} />
				<H3 color="#EDEDED">{`${price}$`}</H3>
			</Card.Footer>
		</Card>
	);
}
