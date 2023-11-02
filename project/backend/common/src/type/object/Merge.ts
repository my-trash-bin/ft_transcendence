import { OptionalKeys } from './OptionalKeys';
import { RequiredKeys } from './RequiredKeys';

export type MergeTwo<A extends {}, B extends {}> = {
  [Key in RequiredKeys<A> & RequiredKeys<B>]: B[Key];
} & {
  [Key in RequiredKeys<A> & OptionalKeys<B>]: A[Key] | B[Key];
} & {
  [Key in Exclude<RequiredKeys<A>, keyof B>]: A[Key];
} & {
  [Key in OptionalKeys<A> & RequiredKeys<B>]: B[Key];
} & {
  [Key in OptionalKeys<A> & OptionalKeys<B>]?: A[Key] | B[Key];
} & {
  [Key in Exclude<OptionalKeys<A>, keyof B>]?: A[Key];
} & {
  [Key in Exclude<RequiredKeys<B>, keyof A>]: B[Key];
} & {
  [Key in Exclude<OptionalKeys<B>, keyof A>]?: B[Key];
};

type RemoveFirst<TTuple extends any[]> = TTuple extends [
  first: TTuple[0],
  ...rest: infer I
]
  ? I
  : never;

type MergeInternal<
  TTypes extends {}[],
  TAccumulator extends {} = {}
> = TTypes['length'] extends 0
  ? TAccumulator
  : RemoveFirst<TTypes> extends {}[]
  ? MergeInternal<RemoveFirst<TTypes>, MergeTwo<TAccumulator, TTypes[0]>>
  : never;

export type Merge<Types extends {}[]> = MergeInternal<Types>;
