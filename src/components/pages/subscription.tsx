import { useSubscription } from '@/hooks/useSubscription';
import { useAppDispatch } from '@/store/hooks';
import { updateSubscription } from '@/store/user/user.slice';
import { Box, Heading, Text, VStack } from 'native-base';
import { ScrollView } from 'tamagui';
import Button from '../atoms/Button';
import { SubscriptionCard } from '../molecules/SubscriptionCard';

export function PickSubscription() {
  const dispatch = useAppDispatch();
  const [
    setActiveChoice,
    handlePickSubscription,
    { packages, purchaseLoading, activeChoice },
  ] = useSubscription();

  function handleSkip() {
    dispatch(updateSubscription({ isSubscribed: false }));
  }

  return (
    <Box
      flex={1}
      w="full"
      safeAreaBottom
      justifyContent="space-between"
      bg="primary.700"
    >
      <VStack space="4" pt="4" px="4">
        <Heading textAlign="center">Pick a Subscription</Heading>
        <Text>Subscribe for better things</Text>
      </VStack>

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

      <VStack px="4">
        <Button
          label="Choose Subscription"
          mb="4"
          disabled={purchaseLoading}
          isLoading={purchaseLoading}
          onPress={handlePickSubscription}
        />
        <Button
          label="Skip"
          onPress={handleSkip}
          disabled={purchaseLoading}
          type="secondary"
        />
      </VStack>
    </Box>
  );
}
