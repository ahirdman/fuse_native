import { useMutation, useQuery } from '@tanstack/react-query';
import * as Burnt from 'burnt';
import { useState } from 'react';
import Purchases, {
  CustomerInfo,
  PurchasesEntitlementInfo,
  PurchasesPackage,
} from 'react-native-purchases';

import { useAppDispatch } from 'store/hooks';
import { showToast } from 'util/toast';

import { updateSubscription } from 'user/user.slice';
import { updateUserSubscriptionData } from './update';

export interface MakePurchaseRes {
  activePackage: PurchasesEntitlementInfo;
  customer: Omit<CustomerInfo, 'entitlements'>;
}

export async function makePurchase(
  subscriptionPackage: PurchasesPackage,
): Promise<MakePurchaseRes> {
  const result = await Purchases.purchasePackage(subscriptionPackage);

  if (!result.customerInfo.entitlements.active.Pro) {
    throw new Error('Unsuccssfull purchase');
  }

  return {
    activePackage: result.customerInfo.entitlements.active.Pro,
    customer: result.customerInfo,
  };
}

export async function getOfferings() {
  const offerings = await Purchases.getOfferings();

  if (offerings.current) {
    return offerings.current.availablePackages;
  }
}

export function useSubscription() {
  const dispatch = useAppDispatch();
  const [activeChoice, setActiveChoice] = useState<PurchasesPackage>();
  const { mutateAsync, isPending: purchaseLoading } = useMutation({
    mutationKey: ['makePurchase'],
    mutationFn: makePurchase,
  });

  const { data: packages } = useQuery({
    queryKey: ['packages'],
    queryFn: getOfferings,
  });

  async function handlePickSubscription() {
    try {
      if (activeChoice === undefined) {
        showToast({
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
      showToast({
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
