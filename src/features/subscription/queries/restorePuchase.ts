import { useMutation } from '@tanstack/react-query';
import Purchases from 'react-native-purchases';

import { showToast } from 'util/toast';

import type { AppSubscription } from 'subscription/subscription.interface';

async function restorePurchase(): Promise<AppSubscription> {
  const result = await Purchases.restorePurchases();

  const activeEntitlement = result.entitlements.active.Pro;

  if (!activeEntitlement) {
    throw new Error('No active subscription for user');
  }

  const restoredSubscription: AppSubscription = {
    appUserId: result.originalAppUserId,
    expirationDate: activeEntitlement.expirationDate,
    isActive: activeEntitlement.isActive,
    isSandbox: activeEntitlement.isSandbox,
    productId: activeEntitlement.productIdentifier,
    willRenew: activeEntitlement.willRenew,
  };

  return restoredSubscription;
}

export const useRestorePurchase = () =>
  useMutation({
    mutationFn: restorePurchase,
    onError: () => {
      showToast({
        title: 'Could not restore purchase',
        preset: 'error',
      });
    },
  });
