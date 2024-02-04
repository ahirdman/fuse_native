import { AuthorizeSpotifyPage } from '@/components/pages/authorize-spotify';
import { CreateUserPage } from '@/components/pages/create-user';
import { PickSubscription } from '@/components/pages/subscription';
import { useAppSelector } from '@/store/hooks';

function SignUpView() {
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

export default SignUpView;
