import { useRouter } from 'expo-router';

import { Text, Button } from 'native-base';

import PageView from '@/components/atoms/PageView';

export default function AuthView() {
  const router = useRouter();

  return (
    <PageView>
      <Button onPress={() => router.push('/(tabs)')}>
        <Text>Sign in!</Text>
      </Button>
    </PageView>
  );
}
