import { Prisma } from '@prisma/client';

enum PrismaErrorCode {
  RecordNotFound = 'P2001',
  UniqueConstraint = 'P2002',
  ForeignKeyConstraintFail = 'P2003',
  RecordToUpdateNotFound = 'P2025',
}

export const PrismaUnknownErrorMessage = 'PrismaClientUnknownRequestError';

function isInstanceOfPrismaError(
  e: unknown,
): e is Prisma.PrismaClientKnownRequestError {
  return e instanceof Prisma.PrismaClientKnownRequestError;
}

function isPrismaError(
  e: unknown,
  errorCode: string,
): e is Prisma.PrismaClientKnownRequestError {
  return isInstanceOfPrismaError(e) && e.code === errorCode;
}

//
/**
 * P2001: RecordNotFound
 * - findUnique or findFirst 쿼리 실행시 조건에 맞는 레코드 찾지 못함. 조회 쿼리 관련에서만 발생
 */
export function isRecordNotFoundError(
  e: unknown,
): e is Prisma.PrismaClientKnownRequestError {
  return isPrismaError(e, PrismaErrorCode.RecordNotFound);
}

/**
 * P2002: UniqueConstraint
 * - 닉네임, id등 레코드 생성시 유니크 조건 오류시
 */
export function isUniqueConstraintError(
  e: unknown,
): e is Prisma.PrismaClientKnownRequestError {
  return isPrismaError(e, PrismaErrorCode.UniqueConstraint);
}

/**
 * P2003: ForeignKeyConstraintFail
 * - 유효하지 않은 UUID등의 관계키 사용시 발생하는 에러
 */
export function IsForeignKeyConstraintFailError(
  e: unknown,
): e is Prisma.PrismaClientKnownRequestError {
  return isPrismaError(e, PrismaErrorCode.ForeignKeyConstraintFail);
}

//
/**
 * P2025: RecordToUpdateNotFound
 * - update, delete, findUnique, findFirst 등의 쿼리 실행시 해당 조건에 맞는 레코드 찾지 못함.
 */
export function IsRecordToUpdateNotFoundError(
  e: unknown,
): e is Prisma.PrismaClientKnownRequestError {
  return isPrismaError(e, PrismaErrorCode.RecordToUpdateNotFound);
}

export function isPrismaUnknownError(
  e: unknown,
): e is Prisma.PrismaClientUnknownRequestError {
  return e instanceof Prisma.PrismaClientUnknownRequestError;
}

export function createPrismaErrorMessage(
  e:
    | Prisma.PrismaClientKnownRequestError
    | Prisma.PrismaClientUnknownRequestError,
): string {
  if (e instanceof Prisma.PrismaClientUnknownRequestError) {
    return `PrismaClientUnknownRequestError :${e.message}`;
  }
  switch (e.code) {
    case 'P2001':
      return `Record not found for the (${e.meta?.target ?? 'unknown'}) fields`;
    case 'P2002':
      return `Unique constraint failed on the (${
        e.meta?.target ?? 'unknown'
      }) fields`;
    case 'P2003':
      return `Foreign key constraint failed on the field: ${
        e.meta?.field_name ?? 'No meta date'
      }`;
    case 'P2025':
      return `An operation failed because it depends on one or more records that were required but not found. cause: ${
        e.meta?.cause ?? 'No meta date'
      }: ${e.message}`;
    default:
      return `An unexpected error occurred: ${e.message}`;
  }
}

/* 샘플
if (isUniqueConstraintError(error)) {
  throw new ConflictException(createPrismaErrorMessage(error));
}
if (
  IsRecordToUpdateNotFoundError(error) ||
  isRecordNotFoundError(error)
) {
  throw new BadRequestException(createPrismaErrorMessage(error));
}
if (isPrismaUnknownError(error)) {
  throw new InternalServerErrorException(createPrismaErrorMessage(error));
}

*/
