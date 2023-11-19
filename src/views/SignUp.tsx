import { Heading, Spacer, Text, View } from 'native-base';
import { useEffect, useState } from 'react';

import PageView from '@/components/atoms/PageView';
import SignUpForm from '@/components/organisms/sign-up-form';
import Accordion from '@/components/atoms/Accordion';
import PrimaryButton from '@/components/atoms/PrimaryButton';
import { authorizeSpotify } from '@/lib/expo/expo.auth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import SecondaryButton from '@/components/atoms/SecondaryButton';
import { setSubscription, setToken } from '@/store/user/user.slice';
import {
  updateUserSpotifyData,
  updateUserSubscriptionData,
} from '@/lib/supabase/supabase.queries';
import AccordionHeader from '@/components/atoms/AccordionHeader';
import { assertIsDefined } from '@/lib/util/assert';

const COLLAPSED_HEIGHT = 80;
const EXPANDED_HEIGHT = 400;

function SignUpView() {
  const [activeAccordion, setActiveAccordion] = useState<number>(0);

  const { user, token, subscription } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      setActiveAccordion(1);
    }

    if (token) {
      setActiveAccordion(2);
    }

    if (subscription) {
      setActiveAccordion(-1);
    }
  }, [user, token, subscription]);

  return (
    <PageView justifyContent="start">
      <Spacer />

      <Accordion
        collapsedHeight={COLLAPSED_HEIGHT}
        expandedHeight={450}
        initial="EXPANDED"
        index={0}
        activeAccordion={activeAccordion}
      >
        {activeAccordion === 0 ? (
          <SignUpForm />
        ) : (
          <AccordionHeader
            label="Account Created"
            iconRight={user !== undefined}
          />
        )}
      </Accordion>

      <Spacer />

      <Accordion
        collapsedHeight={COLLAPSED_HEIGHT}
        expandedHeight={200}
        initial="COLLAPSED"
        index={1}
        activeAccordion={activeAccordion}
      >
        {activeAccordion === 1 ? (
          <AuthorizeSpotify userId={user?.id} />
        ) : (
          <AccordionHeader
            label={`${token ? 'Connected' : 'Connect'} to Spotify`}
            iconRight={token !== undefined}
          />
        )}
      </Accordion>

      <Spacer />

      <Accordion
        collapsedHeight={COLLAPSED_HEIGHT}
        expandedHeight={EXPANDED_HEIGHT}
        initial="COLLAPSED"
        index={2}
        activeAccordion={activeAccordion}
      >
        {activeAccordion === 2 ? (
          <PickSubscription userId={user?.id} />
        ) : (
          <AccordionHeader
            label={`${subscription ? 'Subscribe' : 'Subscribed'} to Fuse`}
            iconRight={subscription !== undefined}
          />
        )}
      </Accordion>

      <Spacer />
    </PageView>
  );
}

export default SignUpView;

function AuthorizeSpotify({ userId }: { userId: string | undefined }) {
  const dispatch = useAppDispatch();
  async function handlePress() {
    if (!userId) return;

    const data = await authorizeSpotify();

    assertIsDefined(data?.refreshToken);

    const { accessToken, tokenType, expiresIn, scope, issuedAt } = data;

    await updateUserSpotifyData({
      tokenData: { accessToken, tokenType, expiresIn, scope, issuedAt },
      refreshToken: data.refreshToken,
      id: userId,
    });

    dispatch(setToken({ accessToken, tokenType, expiresIn, scope, issuedAt }));
  }

  return (
    <View size="full">
      <Heading mb="4">Connect to Spotify</Heading>
      <Text mb="4">
        In order to use FUSE, we need access to your spotify library
      </Text>
      <PrimaryButton label="Authorize Spotify" onPress={handlePress} />
    </View>
  );
}

function PickSubscription({ userId }: { userId: string | undefined }) {
  const dispatch = useAppDispatch();

  async function handleSkip() {
    if (!userId) return;

    const subscriptionState = { subscribed: false };
    await updateUserSubscriptionData({
      isSubscribed: subscriptionState.subscribed,
      id: userId,
    });
    dispatch(setSubscription(subscriptionState));
  }

  function handleSubscribe() {}

  return (
    <View size="full">
      <Heading mb="4">Pick a Subscription</Heading>
      <Text>Subscribe for better things</Text>
      <PrimaryButton label="Subscribe" onPress={handleSubscribe} />
      <SecondaryButton label="Skip" onPress={handleSkip} />
    </View>
  );
}
