import AsyncStorage from "@react-native-async-storage/async-storage";

const asyncStorageKeys = ["SPOTIFY_TOKEN", "SUBSCRIPTION"] as const;
type AsyncStorageKey = (typeof asyncStorageKeys)[number];

interface GetAsyncStorageDataArgs {
	key: AsyncStorageKey;
	value: Record<string, string | number | boolean | undefined>;
}

export async function getStoredData<T>(
	key: AsyncStorageKey,
): Promise<T | null> {
	try {
		const jsonValue = await AsyncStorage.getItem(key);
		return jsonValue !== null ? (JSON.parse(jsonValue) as T) : null;
	} catch (error) {
		return null;
	}
}

export async function setStoredData({ key, value }: GetAsyncStorageDataArgs) {
	try {
		const jsonValue = JSON.stringify(value);
		await AsyncStorage.setItem(key, jsonValue);
	} catch (error) {}
}

export async function clearStoredData(): Promise<void> {
	try {
		const presentKeys = await AsyncStorage.getAllKeys();
		await AsyncStorage.multiRemove(presentKeys);
	} catch (error) {}
}
