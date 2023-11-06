import { OptionalKeys } from './OptionalKeys';
import { RequiredKeys } from './RequiredKeys';

export type SafePick<
  TObject,
  TKey extends keyof TObject = keyof TObject,
> = TObject extends {}
  ? {
      [K in RequiredKeys<TObject> & TKey]: TObject[K];
    } & {
      [K in OptionalKeys<TObject> & TKey]?: TObject[K];
    }
  : TObject;
