export function assertIsDefined<T>(data: T): asserts data is NonNullable<T> {
	if (data === undefined || data === null) {
		throw new Error("Expected data to be defined");
	}
}

// biome-ignore lint/suspicious/noExplicitAny: reason
export function isBoolean(value: any): value is NonNullable<boolean> {
	return value !== undefined && value !== null && typeof value === "boolean";
}

export function isDefined<T>(val?: T): val is NonNullable<T> {
	return val !== undefined && val !== null;
}
