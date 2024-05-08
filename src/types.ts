export type TruePartial<T> = { [K in keyof T]: T[K] | null | undefined };

export type DeepTruePartial<T> = {
  [K in keyof T]: DeepTruePartial<T[K]> | null | undefined;
};

export type DeepRequired<T> = {
  [K in keyof T]: DeepRequired<T[K]>;
};
