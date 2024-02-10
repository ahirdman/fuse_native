import { useAppSelector } from 'store/hooks';

import { PickSubscription } from 'subscription/components/subscription';
import { AuthorizeSpotifyPage } from 'user/components/authorize-spotify';
import { CreateUserPage } from 'user/components/create-user';

export function SignUpView() {
  const { user, spotifyToken, subscription } = useAppSelector(
    (state) => state.user,
  );

  if (!user) {
    return <CreateUserPage />;
  }

  if (!spotifyToken) {
    return <AuthorizeSpotifyPage />;
  }

  if (!subscription) {
    return <PickSubscription />;
  }

  return null;
}
