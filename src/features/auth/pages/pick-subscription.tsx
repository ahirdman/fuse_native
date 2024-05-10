import { Calendar } from '@tamagui/lucide-icons';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Button,
  H3,
  H4,
  Separator,
  Spinner,
  Text,
  View,
  XStack,
  YStack,
} from 'tamagui';

import { showToast } from 'util/toast';

import { useSignUp } from 'auth/proivders/signUp.provider';
import { RadioSelection } from 'components/RadioSelection';
import { SubscriptionRadioLabel } from 'subscription/components/SubscriptionRadioLabel';
import { useGetOfferings } from 'subscription/queries/getOfferings';
import { useMakePurchase } from 'subscription/queries/makePurchase';
import { useRestorePurchase } from 'subscription/queries/restorePuchase';
import type { AppSubscription } from 'subscription/subscription.interface';
import { z } from 'zod';

const selectedPackageSchema = z.object({
  selected: z.string().min(1, { message: 'A subscription has to be selected' }),
});

type SelectPackage = z.infer<typeof selectedPackageSchema>;

export function PickSubscription() {
  const { dispatch } = useSignUp();
  const { data: packages } = useGetOfferings();
  const { mutateAsync: purchaseSubscription, isPending: purchasePending } =
    useMakePurchase();
  const { mutateAsync: restoreSubscription, isPending: restorePending } =
    useRestorePurchase();
  const { control, resetField, handleSubmit } = useForm<SelectPackage>();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (packages) {
      resetField('selected', { defaultValue: packages[0]?.identifier });
    }
  }, [resetField, packages]);

  function handleSuccess(data: AppSubscription) {
    dispatch({
      type: 'submitSubscription',
      payload: data,
    });

    showToast({
      title: 'Thank you!',
      message: 'Enjoy Fuse!',
      preset: 'done',
    });
  }

  async function onPurchase(data: { selected: string }) {
    const selectedPackage = packages?.find(
      (purchasePackage) => purchasePackage.identifier === data.selected,
    );

    if (!selectedPackage) {
      showToast({
        title: 'Something went wrong',
        preset: 'error',
      });

      return;
    }

    await purchaseSubscription(selectedPackage, {
      onSuccess: (data) => handleSuccess(data),
    });
  }

  async function onRestorePurchase() {
    await restoreSubscription(undefined, {
      onSuccess: (data) => handleSuccess(data),
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
        <Text>
          Using Fuse requires a subscription. If you just want to try out the
          app, choose the monthly subscription. If you dont't enjoy Fuse, simply
          cancel the subscription within 14 days and you will never be charged.
        </Text>
      </YStack>

      <YStack gap={12} flex={1} pt={48}>
        <XStack ai="center" gap={12}>
          <Calendar />
          <H4>Subscription Plans</H4>
        </XStack>

        <Separator borderColor="$border300" />

        {!!packages && (
          <RadioSelection
            controlProps={{ control, name: 'selected' }}
            options={packages.map((subPackage) => subPackage.identifier)}
            rowStyle={(option, index) => ({
              pressStyle: { scale: 0.9 },
              animation: 'quick',
              my: 8,
              borderRadius: 8,
              borderWidth: 1,
              borderColor:
                option === packages[index]?.identifier
                  ? '$brandDark'
                  : '$border400',
            })}
            LabelComponent={(_, index) => {
              const purchasePackage = packages[index];

              return (
                <SubscriptionRadioLabel purchasePackage={purchasePackage} />
              );
            }}
          />
        )}
      </YStack>

      <YStack>
        <Button
          mb={16}
          disabled={purchasePending || restorePending}
          fontWeight="bold"
          fontSize="$5"
          onPress={onRestorePurchase}
        >
          {restorePending && (
            <Button.Icon>
              <Spinner />
            </Button.Icon>
          )}
          Restore Purchase
        </Button>
        <Button
          mb={16}
          disabled={purchasePending || restorePending}
          onPress={handleSubmit(onPurchase)}
          bg="$brandDark"
          fontWeight="bold"
          fontSize="$5"
        >
          {purchasePending && (
            <Button.Icon>
              <Spinner />
            </Button.Icon>
          )}
          Continue
        </Button>
      </YStack>
    </View>
  );
}
