import { Link } from 'expo-router';

import { Pressable, Text } from 'native-base';

import PageView from '@/components/atoms/PageView';

export default function SignIn() {
  return (
    <PageView>
      <Link href="/(auth)" replace asChild>
        <Pressable accessibilityRole="button">
          <Text color="brand">Sign out!</Text>
        </Pressable>
      </Link>
    </PageView>
  );
}
