import { PrismaClient } from '@prisma/client';

export type PrismaTransactionClient = Parameters<
  Parameters<PrismaClient['$transaction']>[0]
>[0];

export interface IRepository {
  client: PrismaTransactionClient;
  transaction<T>(func: (repository: IRepository) => Promise<T>): Promise<T>;
}
