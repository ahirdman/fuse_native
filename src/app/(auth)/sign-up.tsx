import { Button, Spacer, Text, View } from 'native-base';
import { useState } from 'react';

import PageView from '@/components/atoms/PageView';
import SignUpForm from '@/hooks/useSignUp';
import Accordion from '@/components/atoms/Accordion';
import PrimaryButton from '@/components/atoms/PrimaryButton';
import { authorizeSpotify } from '@/lib/expo/expo.auth';
import { useAppSelector } from '@/store/hooks';

const COLLAPSED_HEIGHT = 80;
const EXPANDED_HEIGHT = 400;

function SignUpView() {
  const [activeAccordion, setActiveAccordion] = useState<number>(0);
  const user = useAppSelector((state) => state.user.user);

  function handleNext() {
    if (activeAccordion === 2) {
      setActiveAccordion(-1);
    } else {
      setActiveAccordion(activeAccordion + 1);
    }
  }

  return (
    <PageView justifyContent="start">
      <Button onPress={handleNext}>Next</Button>
      <Spacer />
      <Accordion
        collapsedHeight={COLLAPSED_HEIGHT}
        expandedHeight={EXPANDED_HEIGHT}
        initial="EXPANDED"
        index={0}
        activeAccordion={activeAccordion}
        setActiveAccordion={setActiveAccordion}
        headerLeft={<Text>Created Account</Text>}
        headerRight={!user ? <Text>ahirdman</Text> : null}
      >
        <SignUpForm />
      </Accordion>
      <Spacer />
      <Accordion
        collapsedHeight={COLLAPSED_HEIGHT}
        expandedHeight={EXPANDED_HEIGHT}
        initial="COLLAPSED"
        index={1}
        activeAccordion={activeAccordion}
        setActiveAccordion={setActiveAccordion}
      >
        <PrimaryButton
          label="Authorize Spotify"
          onPress={() => authorizeSpotify()}
        />
      </Accordion>
      <Spacer />
      <Accordion
        collapsedHeight={COLLAPSED_HEIGHT}
        expandedHeight={EXPANDED_HEIGHT}
        initial="COLLAPSED"
        index={2}
        activeAccordion={activeAccordion}
        setActiveAccordion={setActiveAccordion}
      >
        <View>
          <Text>Subscribe for better things</Text>
        </View>
      </Accordion>

      <Spacer />
    </PageView>
  );
}

export default SignUpView;
