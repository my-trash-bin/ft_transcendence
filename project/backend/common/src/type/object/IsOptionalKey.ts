export type IsOptionalKey<TObject, TKey extends keyof TObject> = Pick<
  TObject,
  Exclude<keyof TObject, TKey>
> extends TObject
  ? true
  : false;
