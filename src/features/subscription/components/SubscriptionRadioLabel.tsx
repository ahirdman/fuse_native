import type {
  PurchasesIntroPrice,
  PurchasesPackage,
  PurchasesStoreProductDiscount,
} from 'react-native-purchases';
import { type CardProps, H4, H6, Paragraph, XStack, YStack } from 'tamagui';

interface SubscriptionCardProps extends CardProps {
  purchasePackage?: PurchasesPackage | undefined;
}

export function SubscriptionRadioLabel({
  purchasePackage,
}: SubscriptionCardProps) {
  if (!purchasePackage) {
    return null;
  }

  const discount = purchasePackage.product.discounts?.[0];

  return (
    <XStack
      jc="space-between"
      ai="center"
      borderWidth={0}
      f={1}
      py={4}
      pr={12}
      minHeight={88}
    >
      <YStack>
        <H4 textTransform="capitalize">{purchasePackage.product.title}</H4>
        <IntroductionalInfo trial={purchasePackage.product.introPrice} />
        <PromotionalInfo
          discount={discount}
          standardPrice={purchasePackage.product.price}
        />
      </YStack>

      <SubscriptionPriceInfo
        discountPriceString={discount?.priceString}
        standardPriceString={purchasePackage.product.priceString}
      />
    </XStack>
  );
}

function IntroductionalInfo({ trial }: { trial: PurchasesIntroPrice | null }) {
  if (!trial) {
    return null;
  }

  const isMultipleUnits = trial.periodNumberOfUnits !== 1;
  const trialPeriodString = isMultipleUnits
    ? `${trial.periodUnit}s`
    : trial.periodUnit;

  const trialDescription = `Includes ${trial.periodNumberOfUnits} ${trialPeriodString} trial`;

  return (
    <Paragraph color="$lightText" textTransform="lowercase">
      {trialDescription}
    </Paragraph>
  );
}

function PromotionalInfo({
  discount,
  standardPrice,
}: {
  discount: PurchasesStoreProductDiscount | undefined;
  standardPrice: number;
}) {
  if (!discount) {
    return null;
  }

  const discountPercentage =
    ((standardPrice - discount.price) / standardPrice) * 100;
  const discountDescription = `${discountPercentage.toFixed(0)}% off for ${
    discount.periodNumberOfUnits
  } ${discount.periodUnit}`;

  return (
    <Paragraph color="$lightText" textTransform="lowercase">
      {discountDescription}
    </Paragraph>
  );
}

interface SubscriptionPriceInfoProps {
  standardPriceString: string;
  discountPriceString?: string | undefined;
}

function SubscriptionPriceInfo({
  standardPriceString,
  discountPriceString,
}: SubscriptionPriceInfoProps) {
  if (!discountPriceString) {
    return (
      <H6 textAlign="right" fontWeight="bold" color="$white">
        {standardPriceString}
      </H6>
    );
  }

  return (
    <YStack>
      <H6
        textAlign="right"
        fontWeight="bold"
        textDecorationLine="line-through"
        color="$white"
      >
        {standardPriceString}
      </H6>

      <H6 textAlign="right" fontWeight="bold" color="$brandDark">
        {discountPriceString}
      </H6>
    </YStack>
  );
}
