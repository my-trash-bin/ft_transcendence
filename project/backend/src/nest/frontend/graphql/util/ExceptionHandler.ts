import { Exception } from '../../../../main/exception/Exception';

export type ExceptionHandler = (exception: Exception) => Promise<{
  logId: string;
  exception: Exception;
}>;
