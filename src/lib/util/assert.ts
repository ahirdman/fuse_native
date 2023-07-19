export function assertIsDefined<T>(data: T): asserts data is NonNullable<T> {
  if (data === undefined || data === null) {
    throw new Error('Expected data to be defined');
  }
}
