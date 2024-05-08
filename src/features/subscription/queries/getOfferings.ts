import { useQuery } from '@tanstack/react-query';

import Purchases, { type PurchasesPackage } from 'react-native-purchases';

async function getOfferings(): Promise<PurchasesPackage[]> {
  const offerings = await Purchases.getOfferings();

  return offerings.current?.availablePackages ?? [];
}

export const useGetOfferings = () =>
  useQuery({
    queryKey: ['packages'],
    queryFn: getOfferings,
  });
