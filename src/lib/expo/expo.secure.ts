import * as SecureStore from 'expo-secure-store';

const secureStoreKeys = ['SPOTIFY_REFRESH_TOKEN'] as const;

type SecureStoreKey = (typeof secureStoreKeys)[number];

interface StoreItemArgs {
  key: SecureStoreKey;
  value: string;
}

export async function setSecureItem({ key, value }: StoreItemArgs) {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (_error) {}
}

export async function getSecureItem(
  key: SecureStoreKey,
): Promise<string | null> {
  let secureItem: string | null = null;

  try {
    const result = await SecureStore.getItemAsync(key);

    secureItem = result;
  } catch (_error) {}

  return secureItem;
}

export async function clearSecureItem(key: SecureStoreKey) {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (_error) {}
}
