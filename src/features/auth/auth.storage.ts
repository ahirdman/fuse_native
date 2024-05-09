import { userStateSchema } from 'auth/auth.interface';
import { MMKV } from 'react-native-mmkv';
import { stringToJSONSchema } from 'schema';
import type { z } from 'zod';

const authStorage = new MMKV({
  id: 'auth-storage',
  encryptionKey: 'tempAuth',
});

export type UserStorage = z.infer<typeof userStateSchema>;
type UserStorageKey = keyof UserStorage;

export function setAuthStorageValue<K extends UserStorageKey>(
  key: K,
  val: UserStorage[K],
): void {
  authStorage.set(key, JSON.stringify(val));
}

export function getAuthStorageValue<K extends UserStorageKey>(
  key: K,
): UserStorage[K] | undefined {
  const stringValue = authStorage.getString(key);

  if (!stringValue) {
    return undefined;
  }

  const parsedValue = stringToJSONSchema
    .pipe(userStateSchema.shape[key])
    .safeParse(stringValue);

  if (!parsedValue.success) {
    authStorage.delete(key);

    return undefined;
  }

  return parsedValue.data;
}

export function deleteAuthStorageValue(key: UserStorageKey | 'all'): void {
  key === 'all' ? authStorage.clearAll() : authStorage.delete(key);
}

export const allKeys = () => authStorage.getAllKeys();
//
// export function getAllUserStorageValues(): UserState {
//   const keys = ["user", "profile", "spotifyUser", "spotifyToken", "subscription"] as const
//   const UserStateKeyEnum = z.enum(keys);
//
//   const userState: Partial<UserState> = {}
//
//   for (const key of keys) {
//     const value = userStorage.getString(key)
//     const parsedValue = userStateSchema.shape[key].parse(value)
//
//     userState[key] = parsedValue
//   }
//
//   const parsed = userStateSchema.safeParse(userState)
//
//   if (!parsed.success) {
//     throw new Error(parsed.error.message)
//   }
//
//   return parsed.data
// }
