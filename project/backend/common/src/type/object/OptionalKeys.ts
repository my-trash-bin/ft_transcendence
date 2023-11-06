import { IsOptionalKey } from './IsOptionalKey';

export type OptionalKeys<T> = keyof T extends infer K
  ? K extends keyof T
    ? IsOptionalKey<T, K> extends true
      ? K
      : never
    : never
  : never;
