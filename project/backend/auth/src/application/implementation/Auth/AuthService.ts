import { Resolver } from '@ft_transcendence/common/di/Container';
import { AuthType } from '@prisma/client';
import { idOf } from '../../../util/id/idOf';
import { ApplicationImports } from '../../ApplicationImports';
import { IAuthService } from '../../interface/Auth/IAuthService';
import { NoSuchAuthException } from '../../interface/Auth/exception/NoSuchAuthException';
import { AuthViewFT } from '../../interface/Auth/view/AuthView';
import { IRepository } from '../../interface/IRepository';
import { Id } from '../../interface/Id';
import { mapPrismaAuthToAuthView } from './mapPrismaAuthToAuthView';
import { prismaAuthSelect } from './prismaAuthSelect';

export class AuthService implements IAuthService {
  private readonly repository: IRepository;

  constructor(resolve: Resolver<ApplicationImports>) {
    this.repository = resolve('repository');
  }

  async get(type: AuthType, id: string): Promise<AuthViewFT> {
    const prismaAuth = await this.repository.client.auth.findUnique({
      where: { type_id: { type, id } },
      select: prismaAuthSelect,
    });
    if (!prismaAuth) {
      throw new NoSuchAuthException(type, id);
    }
    return mapPrismaAuthToAuthView(prismaAuth);
  }

  async getOrCreate(
    type: AuthType,
    id: string,
    metadataJson: string,
  ): Promise<AuthViewFT> {
    switch (type) {
      case 'FT':
        return this.getOrCreateFT(idOf(id), metadataJson);
    }
  }

  async getOrCreateFT(
    ftId: Id<'FT'>,
    metadataJson: string,
  ): Promise<AuthViewFT> {
    const prismaAuth = await this.repository.client.auth.upsert({
      where: { type_id: { type: 'FT', id: ftId.value } },
      create: {
        type: 'FT',
        id: ftId.value,
        metadataJson,
        user: { create: {} },
      },
      update: { metadataJson },
    });
    return mapPrismaAuthToAuthView(prismaAuth) as AuthViewFT;
  }
}
