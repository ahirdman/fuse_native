import { Button, Text } from 'native-base';

import PageView from '@/components/atoms/PageView';
import { supabaseSignOut } from '@/lib/supabase/supabase.auth';

export default function Lists() {
  return (
    <PageView>
      <Button onPress={() => supabaseSignOut()}>
        <Text>Sign Out</Text>
      </Button>
    </PageView>
  );
}
