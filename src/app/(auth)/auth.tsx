import { Link } from 'expo-router';

import { Pressable, Text } from 'native-base';

import PageView from '@/components/atoms/PageView';

export default function SignIn() {
  return (
    <PageView>
      <Link href="/(tabs)/lists" asChild>
        <Pressable accessibilityRole="button">
          <Text color="brand">Sign in!</Text>
        </Pressable>
      </Link>
    </PageView>
  );
}
