import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'sign-in',
};

function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" options={{ title: 'Sign In' }} />
      <Stack.Screen
        name="reset-password"
        options={{ title: 'Forgot Password', presentation: 'modal' }}
      />
      <Stack.Screen
        name="sign-up"
        options={{ title: 'Create User', presentation: 'modal' }}
      />
    </Stack>
  );
}

export default AuthLayout;
