import { Exception } from './Exception';

export type ExceptionHandler = (exception: Exception) => Promise<{
  logId: string;
  exception: Exception;
}>;
