import { supabase } from 'lib/supabase/supabase.init';

import type { MakePurchaseRes } from 'subscription/queries/makePurchase';

export async function upsertUserSubscriptionData({
  activePackage,
  customer,
}: MakePurchaseRes): Promise<void> {
  const { data, error } = await supabase
    .from('subscriptions')
    .upsert({
      app_user_id: customer.originalAppUserId,
      expiration_date: activePackage.expirationDate,
      is_active: activePackage.isActive,
      is_sandbox: activePackage.isSandbox,
      product_id: activePackage.productIdentifier,
      will_renew: activePackage.willRenew,
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(error.message ?? 'No data returned');
  }

  const { error: userError } = await supabase
    .from('accounts')
    .update({
      subscription: data.id,
    })
    .eq('id', data.user_id);

  if (userError) {
    throw new Error(userError.message);
  }
}
