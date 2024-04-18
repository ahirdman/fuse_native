import { Button, H3, ScrollView, Spinner, Text, YStack } from 'tamagui';

import { useAppDispatch } from 'store/hooks';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SubscriptionCard } from 'subscription/components/SubscriptionCard';
import { useSubscription } from 'subscription/queries/useSubscription';
import { updateSubscription } from 'user/user.slice';

export function PickSubscription() {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const [
    setActiveChoice,
    handlePickSubscription,
    { packages, purchaseLoading, activeChoice },
  ] = useSubscription();

  function handleSkip() {
    dispatch(updateSubscription({ isSubscribed: false }));
  }

  return (
    <YStack
      fullscreen
      pb={insets.bottom}
      justifyContent="space-between"
      bg="$primary700"
    >
      <YStack gap={16} pt={16} px={16}>
        <H3 textAlign="center">Pick a Subscription</H3>
        <Text textAlign="center">Subscribe for better things</Text>
      </YStack>

      <ScrollView padding={16}>
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
      </ScrollView>

      <YStack px={16}>
        <Button
          mb={16}
          disabled={purchaseLoading}
          onPress={handlePickSubscription}
          bg="$brandDark"
          fontWeight="bold"
        >
          {purchaseLoading && (
            <Button.Icon>
              <Spinner />
            </Button.Icon>
          )}
          Choose Subscription
        </Button>
        <Button
          onPress={handleSkip}
          disabled={purchaseLoading}
          fontWeight="bold"
        >
          Skip
        </Button>
      </YStack>
    </YStack>
  );
}
