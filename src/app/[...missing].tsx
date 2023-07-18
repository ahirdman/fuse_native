import { Link, Stack } from 'expo-router';

import { Pressable, Text } from 'native-base';

import PageView from '@/components/atoms/PageView';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <PageView>
        <Text>Missing Page</Text>
        <Link href="/" replace asChild>
          <Pressable accessibilityRole="button">
            <Text color="brand">Sign out!</Text>
          </Pressable>
        </Link>
      </PageView>
    </>
  );
}
