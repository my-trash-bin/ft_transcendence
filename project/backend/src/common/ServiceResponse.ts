import { ServiceError } from './ServiceError';

export type ServiceResponse<T> = {
  ok: boolean;
  data?: T;
  error?: ServiceError;
};

export function newServiceOkResponse<T>(data: T): ServiceResponse<T> {
  return {
    ok: true,
    data,
  };
}

export function newServiceFailResponse<T>(
  message: string,
  statusCode: number,
): ServiceResponse<T> {
  return {
    ok: false,
    error: new ServiceError(message, statusCode),
  };
}

export function newServiceFailUnhandledResponse<T>(
  statusCode: number,
): ServiceResponse<T> {
  return newServiceFailResponse('Unhandled error', statusCode);
}

export function newServiceFailPrismaKnownResponse<T>(
  errorCode: string,
  statusCode: number,
): ServiceResponse<T> {
  return newServiceFailResponse(`Prisma Known Error: ${errorCode}`, statusCode);
}

export function newServiceFailPrismaUnKnownResponse<T>(
  statusCode: number,
): ServiceResponse<T> {
  return newServiceFailResponse('Prisma Known Error', statusCode);
}
