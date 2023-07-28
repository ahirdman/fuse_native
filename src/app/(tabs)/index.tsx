import { Button, Text } from 'native-base';

import PageView from '@/components/atoms/PageView';
import { useLazySignOutQuery } from '@/services/auth/auth.endpoints';

export default function Home() {
  const [signOut] = useLazySignOutQuery();

  function handleOnPress() {
    void signOut({});
  }

  return (
    <PageView>
      <Button onPress={handleOnPress}>
        <Text>Sign Out</Text>
      </Button>
    </PageView>
  );
}
