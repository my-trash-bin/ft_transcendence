import { PrismaClient } from '@prisma/client';

export type PrismaTransactionClient = Parameters<
  Parameters<PrismaClient['$transaction']>[0]
>[0];

export interface Repository {
  client: PrismaTransactionClient;
  transaction<T>(func: (repository: Repository) => Promise<T>): Promise<T>;
}

class TransactionRepository implements Repository {
  public client: PrismaTransactionClient;

  public constructor(client: PrismaTransactionClient) {
    this.client = client;
  }

  async transaction<T>(
    func: (repository: Repository) => Promise<T>,
  ): Promise<T> {
    return await func(new TransactionRepository(this.client));
  }
}

class NonTransactionRepository implements Repository {
  public client: PrismaClient;

  public constructor(client: PrismaClient) {
    this.client = client;
  }

  async transaction<T>(
    func: (repository: Repository) => Promise<T>,
  ): Promise<T> {
    return await this.client.$transaction(
      async (tx) => await func(new TransactionRepository(tx)),
    );
  }
}

export function createRepository(): Repository {
  return new NonTransactionRepository(new PrismaClient());
}
