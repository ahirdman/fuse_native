import { useRouter } from 'expo-router';

import { Button, Text } from 'native-base';

import PageView from '@/components/atoms/PageView';

export default function Lists() {
  const router = useRouter();

  return (
    <PageView>
      <Button onPress={() => router.replace('/sign-in')}>
        <Text>Sign Out</Text>
      </Button>
    </PageView>
  );
}
