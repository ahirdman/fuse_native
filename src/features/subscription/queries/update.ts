import { supabase } from 'lib/supabase/supabase.init';
import type { MakePurchaseRes } from './useSubscription';

export async function updateUserSubscriptionData({
  activePackage,
  customer,
}: MakePurchaseRes) {
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
    return { error: { message: 'Error writing to subscriptions table ' } };
  }

  const { error: userError } = await supabase
    .from('accounts')
    .upsert({ subscription: data.id });

  if (userError) {
    return { error: { message: 'Error writing to user table ' } };
  }

  return data;
}
