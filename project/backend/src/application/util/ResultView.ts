import { IsNever } from '../../util/type/IsNever';

export type ResultView<
  TOnSucceededType,
  TOnSucceededFieldName extends string,
  TOnFailureType = never,
  TOnFailureFieldName extends string = 'error',
  TSucceededFieldName extends string = 'succeeded',
> =
  | ({
      [K in TSucceededFieldName]: true;
    } & {
      [K in TOnSucceededFieldName]: TOnSucceededType;
    })
  | ({
      [K in TSucceededFieldName]: false;
    } & (IsNever<TOnFailureType> extends true
      ? {}
      : {
          [K in TOnFailureFieldName]: TOnFailureType;
        }));
