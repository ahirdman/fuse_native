import * as Device from 'expo-device';
import {
  type ExpoPushToken,
  getExpoPushTokenAsync,
  getPermissionsAsync,
  requestPermissionsAsync,
  setNotificationHandler,
} from 'expo-notifications';
import { useCallback, useEffect } from 'react';

import { updatePushToken } from 'auth/auth.slice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { showToast } from 'util/toast';

setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function useNotifications(): void {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleTokenRecived = useCallback(
    async (token: ExpoPushToken): Promise<void> => {
      try {
        const isNewToken = user?.pushToken !== token.data;

        if (!isNewToken || !user) {
          return;
        }

        dispatch(updatePushToken(token.data));
      } catch (_error) {
        showToast({
          preset: 'error',
          title: 'Error regitering notification',
        });
      }
    },
    [dispatch, user],
  );

  useEffect(() => {
    if (!user) {
      return;
    }

    requestExpoPushToken().then((devicePushToken) => {
      if (devicePushToken) {
        handleTokenRecived(devicePushToken);
      }
    });
  }, [user, handleTokenRecived]);
}

async function requestExpoPushToken(): Promise<ExpoPushToken | undefined> {
  if (!Device.isDevice) {
    return undefined;
  }

  const { status: permissionStatus } = await getPermissionsAsync();

  if (permissionStatus === 'granted') {
    return await getDeviceToken();
  }

  const { status: requestPermissionStatus } = await requestPermissionsAsync();

  if (requestPermissionStatus === 'granted') {
    return await getDeviceToken();
  }

  return undefined;
}

async function getDeviceToken(): Promise<ExpoPushToken | undefined> {
  try {
    const deviceToken = await getExpoPushTokenAsync();

    return deviceToken;
  } catch (_error) {
    showToast({
      preset: 'error',
      title: 'Couldnt register notification token',
    });

    return undefined;
  }
}
