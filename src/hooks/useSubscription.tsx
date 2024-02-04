import { getOfferings, makePurchase } from '@/lib/subscription';
import { updateUserSubscriptionData } from '@/lib/supabase/supabase.queries';
import { useAppDispatch } from '@/store/hooks';
import { updateSubscription } from '@/store/user/user.slice';
import * as Burnt from 'burnt';
import { useState } from 'react';
import { PurchasesPackage } from 'react-native-purchases';
import { useMutation, useQuery } from 'react-query';

export function useSubscription() {
  const dispatch = useAppDispatch();
  const [activeChoice, setActiveChoice] = useState<PurchasesPackage>();
  const { mutateAsync, isLoading: purchaseLoading } = useMutation(
    'makePurchase',
    makePurchase,
  );
  const { data: packages } = useQuery('packages', getOfferings);

  async function handlePickSubscription() {
    try {
      if (activeChoice === undefined) {
        Burnt.toast({
          title: 'You have to choose a subscription',
          preset: 'error',
        });
        return;
      }

      const purchaseInfo = await mutateAsync(activeChoice);
      await updateUserSubscriptionData(purchaseInfo);

      dispatch(
        updateSubscription({
          package: {
            app_user_id: purchaseInfo.customer.originalAppUserId,
            expiration_date: purchaseInfo.activePackage.expirationDate,
            is_active: purchaseInfo.activePackage.isActive,
            is_sandbox: purchaseInfo.activePackage.isSandbox,
            product_id: purchaseInfo.activePackage.productIdentifier,
            will_renew: purchaseInfo.activePackage.willRenew,
          },
          isSubscribed: true,
        }),
      );
      Burnt.alert({
        title: 'Success',
        preset: 'done',
        message: 'Congratulations, enjoy Fuse!',
        duration: 3,
      });
    } catch (_error) {
      Burnt.toast({
        title: 'Something went wrong',
        preset: 'error',
        message: 'Error making purchase',
      });
    }
  }

  return [
    setActiveChoice,
    handlePickSubscription,
    { packages, purchaseLoading, activeChoice },
  ] as const;
}
