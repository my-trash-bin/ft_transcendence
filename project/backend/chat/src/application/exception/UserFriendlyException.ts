import { Exception } from './Exception';

export type UserFriendlyExceptionType = 'DUPLICATE_NICKNAME';
export type UserFriendlyExceptionTypeToData<
  T extends UserFriendlyExceptionType,
> = {
  DUPLICATE_NICKNAME: { nickname: string };
}[T];

export class UserFriendlyException<
  T extends UserFriendlyExceptionType,
> extends Exception {
  public readonly code: T;
  public readonly data: UserFriendlyExceptionTypeToData<T>;

  constructor(
    name: string,
    message: string,
    code: T,
    data: UserFriendlyExceptionTypeToData<T>,
  ) {
    super(name, message);
    this.code = code;
    this.data = data;
  }
}
