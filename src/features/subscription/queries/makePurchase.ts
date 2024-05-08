import { useMutation } from '@tanstack/react-query';
import { supabase } from 'lib/supabase/supabase.init';
import Purchases, {
  type CustomerInfo,
  type PurchasesEntitlementInfo,
  type PurchasesPackage,
} from 'react-native-purchases';
import type { AppSubscription } from 'subscription/subscription.interface';
import { showToast } from 'util/toast';
import { upsertUserSubscriptionData } from './upsertUserSubscription';

export interface MakePurchaseRes {
  activePackage: PurchasesEntitlementInfo;
  customer: Omit<CustomerInfo, 'entitlements'>;
}

async function makePurchase(
  subscriptionPackage: PurchasesPackage,
): Promise<AppSubscription> {
  const result = await Purchases.purchasePackage(subscriptionPackage);

  if (!result.customerInfo.entitlements.active.Pro) {
    throw new Error('Unsuccssfull purchase');
  }

  const activePackage = result.customerInfo.entitlements.active.Pro;
  const appSubscription: AppSubscription = {
    willRenew: activePackage.willRenew,
    isSandbox: activePackage.isSandbox,
    appUserId: result.customerInfo.originalAppUserId,
    expirationDate: activePackage.expirationDate,
    isActive: activePackage.isActive,
    productId: activePackage.productIdentifier,
  };

  await upsertUserSubscriptionData({
    activePackage,
    customer: result.customerInfo,
  });

  return appSubscription;
}

export const useMakePurchase = () =>
  useMutation({
    mutationFn: makePurchase,
    onError: () => {
      showToast({
        title: 'Error purchasing subscription',
        preset: 'error',
      });
    },
  });
