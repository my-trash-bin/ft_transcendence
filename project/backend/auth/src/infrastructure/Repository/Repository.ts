import { PrismaClient } from '@prisma/client';
import {
  IRepository,
  PrismaTransactionClient,
} from '../../application/interface/IRepository';

class TransactionRepository implements IRepository {
  public client: PrismaTransactionClient;

  public constructor(client: PrismaTransactionClient) {
    this.client = client;
  }

  async transaction<T>(
    func: (repository: IRepository) => Promise<T>,
  ): Promise<T> {
    return await func(new TransactionRepository(this.client));
  }
}

class NonTransactionRepository implements IRepository {
  public client: PrismaClient;

  public constructor(client: PrismaClient) {
    this.client = client;
  }

  async transaction<T>(
    func: (repository: IRepository) => Promise<T>,
  ): Promise<T> {
    return await this.client.$transaction(
      async (tx) => await func(new TransactionRepository(tx)),
    );
  }
}

export function createRepository(): IRepository {
  return new NonTransactionRepository(new PrismaClient());
}
