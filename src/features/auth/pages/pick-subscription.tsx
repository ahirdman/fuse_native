import { useState } from 'react';
import type { PurchasesPackage } from 'react-native-purchases';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, H3, ScrollView, Spinner, Text, View, YStack } from 'tamagui';

import { showToast } from 'util/toast';

import { useSignUp } from 'auth/proivders/signUp.provider';
import { SubscriptionCard } from 'subscription/components/SubscriptionCard';
import { useGetOfferings } from 'subscription/queries/getOfferings';
import { useMakePurchase } from 'subscription/queries/makePurchase';

export function PickSubscription() {
  const [activeChoice, setActiveChoice] = useState<PurchasesPackage>();
  const { dispatch } = useSignUp();
  const { data: packages, isPending: purchasePending } = useGetOfferings();
  const { mutateAsync: purchaseSubscription } = useMakePurchase();

  const insets = useSafeAreaInsets();

  async function onPurchase() {
    if (!activeChoice) {
      showToast({
        title: 'Pick a subscription',
        preset: 'none',
      });

      return;
    }

    await purchaseSubscription(activeChoice, {
      onSuccess: (data) => {
        dispatch({
          type: 'submitSubscription',
          payload: data,
        });

        showToast({
          title: 'Thank you!',
          message: 'Enjoy Fuse!',
          preset: 'done',
        });
      },
    });
  }

  return (
    <View
      key="subscription"
      w="$full"
      h="$full"
      justifyContent="space-between"
      bg="$primary700"
      pb={insets.bottom}
      pt={24}
      px={24}
    >
      <YStack>
        <H3>Pick a Subscription</H3>
        <Text>Subscribe for better things</Text>
      </YStack>

      <ScrollView mt={24}>
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

      <YStack>
        <Button
          mb={16}
          disabled={purchasePending}
          onPress={onPurchase}
          bg="$brandDark"
          fontWeight="bold"
          fontSize="$5"
        >
          {purchasePending && (
            <Button.Icon>
              <Spinner />
            </Button.Icon>
          )}
          Purchase Subscription
        </Button>
      </YStack>
    </View>
  );
}
