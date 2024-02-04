import { useSubscription } from '@/hooks/useSubscription';
import { useAppSelector } from '@/store/hooks';
import { SubscriptionPackage } from '@/store/user/user.interface';
import { XCircle } from '@tamagui/lucide-icons';
import { H4, H6, Paragraph, XStack, YStack } from 'tamagui';
import Button from '../atoms/Button';
import { SubscriptionCard } from '../molecules/SubscriptionCard';

interface SheetProps {
  onClose(): void;
  title: string;
}

export function SubscriptionSheet({ onClose, title }: SheetProps) {
  const subscriptionData = useAppSelector((state) => state.user.subscription);

  return (
    <YStack gap={16}>
      <XStack justifyContent="space-between" alignItems="center">
        <H4>{title}</H4>
        <XCircle onPress={onClose} />
      </XStack>
      {subscriptionData?.package ? (
        <CurrentSubscription subscription={subscriptionData.package} />
      ) : (
        <NoSubscription />
      )}
    </YStack>
  );
}

interface CurrentSubscriptionProps {
  subscription: SubscriptionPackage;
}

function CurrentSubscription({ subscription }: CurrentSubscriptionProps) {
  const subscriptionType = subscription.product_id.slice(4);
  const expirationDate = new Date(
    subscription.expiration_date ?? '',
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

function NoSubscription() {
  const [
    setActiveChoice,
    handlePickSubscription,
    { packages, purchaseLoading, activeChoice },
  ] = useSubscription();

  return (
    <YStack gap={16}>
      <Paragraph>You are not subscribed. Pick a subscription:</Paragraph>
      <YStack>
        {packages?.map((sub) => {
          const title = sub.product.identifier.slice(4);

          return (
            <SubscriptionCard
              key={sub.identifier}
              onPress={() => setActiveChoice(sub)}
              active={activeChoice?.identifier === sub.identifier}
              title={title}
              price={sub.product.priceString}
              marginVertical="$3"
            />
          );
        })}
      </YStack>

      <Button
        label="Choose Subscription"
        mb="4"
        disabled={purchaseLoading}
        isLoading={purchaseLoading}
        onPress={handlePickSubscription}
      />
    </YStack>
  );
}
