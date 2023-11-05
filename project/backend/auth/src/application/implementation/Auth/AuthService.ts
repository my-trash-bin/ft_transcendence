import { Resolver } from '@ft_transcendence/common/di/Container';
import { AuthType } from '@prisma/client';

import { idOf } from '../../../util/id/idOf';
import { ApplicationImports } from '../../ApplicationImports';
import { RequestContext } from '../../RequestContext';
import { IAuthService } from '../../interface/Auth/IAuthService';
import { NoSuchAuthException } from '../../interface/Auth/exception/NoSuchAuthException';
import { AuthView, AuthViewFT } from '../../interface/Auth/view/AuthView';
import { IRepository } from '../../interface/IRepository';
import { Id } from '../../interface/Id';
import { UserId } from '../../interface/User/view/UserView';
import { ensureSystem } from '../../util/ensureSystem';
import { mapPrismaAuthToAuthView } from './mapPrismaAuthToAuthView';
import { prismaAuthSelect } from './prismaAuthSelect';

export class AuthService implements IAuthService {
  private readonly repository: IRepository;
  private readonly requestContext: RequestContext;

  constructor(resolve: Resolver<ApplicationImports>) {
    this.repository = resolve('repository');
    this.requestContext = resolve('requestContext');
  }

  async get(type: AuthType, id: string): Promise<AuthView> {
    ensureSystem(this.requestContext);
    const prismaAuth = await this.repository.client.auth.findUnique({
      where: { type_id: { type, id } },
      select: prismaAuthSelect,
    });
    if (!prismaAuth) {
      throw new NoSuchAuthException(type, id);
    }
    return mapPrismaAuthToAuthView(prismaAuth);
  }

  async getById(id: UserId): Promise<AuthView> {
    ensureSystem(this.requestContext);
    const prismaAuth = await this.repository.client.auth.findUnique({
      where: { userId: id.value },
      select: prismaAuthSelect,
    });
    if (!prismaAuth) {
      throw new NoSuchAuthException(id.value);
    }
    return mapPrismaAuthToAuthView(prismaAuth);
  }

  async upsert(
    type: AuthType,
    id: string,
    metadataJson: string,
  ): Promise<AuthViewFT> {
    switch (type) {
      case 'FT':
        return this.upsertFT(idOf(id), metadataJson);
    }
  }

  async upsertFT(ftId: Id<'FT'>, metadataJson: string): Promise<AuthViewFT> {
    ensureSystem(this.requestContext);
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
