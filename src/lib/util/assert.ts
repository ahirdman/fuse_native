export function assertIsDefined<T>(data: T): asserts data is NonNullable<T> {
  if (data === undefined || data === null) {
    throw new Error('Expected data to be defined');
  }
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/
export function isBoolean(value: any): value is NonNullable<boolean> {
  return value !== undefined && value !== null && typeof value === 'boolean';
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/
export function isDefined(value: any): boolean {
  return value !== undefined && value !== null;
}
