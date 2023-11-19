import { Button, Text } from 'native-base';

import PageView from '@/components/atoms/PageView';
import { useLazySignOutQuery } from '@/services/auth/auth.endpoints';
import { useAppDispatch } from '@/store/hooks';
import { signOut } from '@/store/user/user.slice';

export default function Lists() {
  const [signOutQuery] = useLazySignOutQuery();
  const dispatch = useAppDispatch();

  function handleOnPress() {
    void signOutQuery();
    dispatch(signOut());
  }

  return (
    <PageView>
      <Button onPress={handleOnPress}>
        <Text>Sign Out</Text>
      </Button>
    </PageView>
  );
}
