import { IsRequiredKey } from './IsRequiredKey';

export type RequiredKeys<T> = keyof T extends infer K
  ? K extends keyof T
    ? IsRequiredKey<T, K> extends true
      ? K
      : never
    : never
  : never;
