export type IsRequiredKey<TObject, TKey extends keyof TObject> = Pick<
  TObject,
  Exclude<keyof TObject, TKey>
> extends TObject
  ? false
  : true;
