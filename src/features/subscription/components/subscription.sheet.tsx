import { XCircle } from '@tamagui/lucide-icons';
import { H4, H6, Paragraph, XStack, YStack } from 'tamagui';

import { useAppSelector } from 'store/hooks';
import type { AppSubscription } from 'subscription/subscription.interface';

interface SheetProps {
  onClose(): void;
  title: string;
}

export function SubscriptionSheet({ onClose, title }: SheetProps) {
  const subscriptionData = useAppSelector((state) => state.auth.subscription);

  return (
    <YStack gap={16}>
      <XStack justifyContent="space-between" alignItems="center">
        <H4>{title}</H4>
        <XCircle onPress={onClose} />
      </XStack>
      <CurrentSubscription subscription={subscriptionData} />
    </YStack>
  );
}

interface CurrentSubscriptionProps {
  subscription?: AppSubscription | undefined;
}

function CurrentSubscription({ subscription }: CurrentSubscriptionProps) {
  if (!subscription) {
    return null;
  }

  const subscriptionType = subscription.productId.slice(4);
  const expirationDate = new Date(
    subscription.expirationDate ?? '',
  ).toDateString();

  return (
    <>
      <YStack justifyContent="space-between">
        <XStack justifyContent="space-between">
          <Paragraph fontWeight="$8">Current Subscription:</Paragraph>
          <H6 textTransform="capitalize">{subscriptionType}</H6>
        </XStack>

        <XStack justifyContent="space-between">
          <Paragraph fontWeight="$8">Subscription Renews:</Paragraph>
          <H6>{expirationDate}</H6>
        </XStack>
      </YStack>

      <Paragraph>
        To cancel, or change subscription. Go to your profile in App Store
      </Paragraph>
    </>
  );
}
