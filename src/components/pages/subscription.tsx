import { updateUserSubscriptionData } from '@/lib/supabase/supabase.queries';
import { useAppDispatch } from '@/store/hooks';
import { updateSubscription } from '@/store/user/user.slice';
import { Box, Heading, Text, VStack } from 'native-base';
import { useState } from 'react';
import { ScrollView } from 'tamagui';
import Button from '../atoms/Button';
import { SubscriptionCard } from '../molecules/SubscriptionCard';

interface PickSubscriptionProps {
  userId: string;
}

type AppSubscriptionType = 'MONTHLY' | 'YEARLY' | 'TRIAL';

interface AppSubscription {
  type: AppSubscriptionType;
  title: string;
  desc: string;
  price: number;
}

const subscriptions: AppSubscription[] = [
  {
    type: 'YEARLY',
    title: 'Yearly',
    desc: 'Save some money',
    price: 20,
  },
  {
    type: 'MONTHLY',
    title: 'Monthly',
    desc: 'Default choice for most',
    price: 2,
  },
  {
    type: 'TRIAL',
    title: 'Trial',
    desc: 'Try it out first',
    price: 0,
  },
];

export function PickSubscription({ userId }: PickSubscriptionProps) {
  const dispatch = useAppDispatch();
  const [activeChoice, setActiveChoice] =
    useState<AppSubscriptionType>('TRIAL');

  async function handlePickSubscription(userId: string) {
    const subscriptionState = { subscribed: false };

    await updateUserSubscriptionData({
      isSubscribed: subscriptionState.subscribed,
      id: userId,
    });

    dispatch(updateSubscription(subscriptionState));
  }

  return (
    <Box
      flex={1}
      w="full"
      safeAreaBottom
      justifyContent="space-between"
      bg="primary.700"
    >
      <VStack space="4" pt="4" px="4">
        <Heading textAlign="center">Pick a Subscription</Heading>
        <Text>Subscribe for better things</Text>
      </VStack>

      <ScrollView space padding={16}>
        {subscriptions.map(({ type, title, desc, price }) => (
          <SubscriptionCard
            key={type}
            onPress={() => setActiveChoice(type)}
            active={activeChoice === type}
            title={title}
            price={price}
            body={desc}
          />
        ))}
      </ScrollView>

      <VStack px="4">
        <Button
          label="Choose Subscription"
          mb="4"
          onPress={() => handlePickSubscription(userId)}
        />
      </VStack>
    </Box>
  );
}
