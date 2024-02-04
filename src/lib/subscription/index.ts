import Purchases, {
  CustomerInfo,
  PurchasesEntitlementInfo,
  PurchasesPackage,
} from 'react-native-purchases';

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
