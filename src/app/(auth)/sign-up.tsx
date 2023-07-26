import { Heading, Icon, Spacer, Text, View } from 'native-base';
import { useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

import PageView from '@/components/atoms/PageView';
import SignUpForm from '@/components/organisms/sign-up-form';
import Accordion from '@/components/atoms/Accordion';
import PrimaryButton from '@/components/atoms/PrimaryButton';
import { authorizeSpotify } from '@/lib/expo/expo.auth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import SecondaryButton from '@/components/atoms/SecondaryButton';
import { useAuth } from '@/providers/auth.provider';
import { setSubscription } from '@/store/user/user.slice';

const COLLAPSED_HEIGHT = 80;
const EXPANDED_HEIGHT = 400;

function SignUpView() {
  const [activeAccordion, setActiveAccordion] = useState<number>(0);
  const session = useAuth();

  const { token, subscription } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (session?.session?.user) {
      setActiveAccordion(1);
    }

    if (token) {
      setActiveAccordion(2);
    }

    if (subscription) {
      setActiveAccordion(-1);
    }
  }, [session, token, subscription]);

  return (
    <PageView justifyContent="start">
      <Spacer />

      <Accordion
        collapsedHeight={COLLAPSED_HEIGHT}
        expandedHeight={450}
        initial="EXPANDED"
        index={0}
        activeAccordion={activeAccordion}
        headerLeft={<Text fontWeight="bold">Created Account</Text>}
        headerRight={
          <Text color="success.500">{session?.session?.user.email}</Text>
        }
      >
        <SignUpForm />
      </Accordion>

      <Spacer />

      <Accordion
        collapsedHeight={COLLAPSED_HEIGHT}
        expandedHeight={200}
        initial="COLLAPSED"
        index={1}
        activeAccordion={activeAccordion}
        headerLeft={<Text fontWeight="bold">Connected to Spotify</Text>}
        headerRight={
          token ? (
            <Icon
              as={<Ionicons name="ios-checkmark-circle-outline" />}
              size={5}
              color="success.500"
            />
          ) : null
        }
      >
        <AuthorizeSpotify />
      </Accordion>

      <Spacer />

      <Accordion
        collapsedHeight={COLLAPSED_HEIGHT}
        expandedHeight={EXPANDED_HEIGHT}
        initial="COLLAPSED"
        index={2}
        activeAccordion={activeAccordion}
      >
        <PickSubscription />
      </Accordion>

      <Spacer />
    </PageView>
  );
}

export default SignUpView;

function AuthorizeSpotify() {
  return (
    <View size="full">
      <Heading mb="4">Connect to Spotify</Heading>
      <Text mb="4">
        In order to use FUSE, we need access to your spotify library
      </Text>
      <PrimaryButton
        label="Authorize Spotify"
        onPress={() => authorizeSpotify()}
      />
    </View>
  );
}

function PickSubscription() {
  const dispatch = useAppDispatch();

  function handleSkip() {
    dispatch(setSubscription({ subscribed: false }));
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
