import { Resolver } from '@ft_transcendence/common/di/Container';
import { v4 } from 'uuid';
import { getId } from '../../../util/id/getId';
import { idOf } from '../../../util/id/idOf';
import { sortAs } from '../../../util/sortAs';
import { ApplicationImports } from '../../ApplicationImports';
import { RequestContext } from '../../RequestContext';
import { InvalidAccessException } from '../../exception/InvalidAccessException';
import { InvalidIdException } from '../../exception/InvalidIdException';
import { IRepository } from '../../interface/IRepository';
import { IUserService } from '../../interface/User/IUserService';
import { DuplicateNicknameException } from '../../interface/User/exception/DuplicateNicknameException';
import {
  AuthUserId,
  UserId,
  UserView,
} from '../../interface/User/view/UserView';
import { invalidId } from '../../util/exception/invalidId';
import { isUniqueConstraintError } from '../../util/isUniqueConstraintError';
import { mapPrismaUserToUserView } from './mapPrismaUserToUserView';
import { prismaUserSelect } from './prismaUserSelect';

export class UserService implements IUserService {
  private readonly repository: IRepository;
  private readonly requestContext: RequestContext;

  constructor(resolve: Resolver<ApplicationImports>) {
    this.repository = resolve('repository');
    this.requestContext = resolve('requestContext');
  }

  async getOrCreateIdByAuthId(id: AuthUserId): Promise<UserId> {
    this.ensureSystem();
    const userV2 = await this.repository.client.mainUser.upsert({
      where: { authUserId: id.value },
      create: { nickname: `new user ${v4()}`, authUserId: id.value },
      update: {},
      select: { id: true },
    });
    return idOf(userV2.id);
  }

  async getMany(
    ids: readonly UserId[],
  ): Promise<(UserView | InvalidIdException)[]> {
    const stringIds = ids.map(({ value }) => value);
    const prismaUsers = await this.repository.client.mainUser.findMany({
      where: { id: { in: stringIds } },
    });
    return sortAs(
      prismaUsers.map(mapPrismaUserToUserView),
      stringIds,
      getId,
      invalidId,
    );
  }

  async create(nickname: string, authUserId: string): Promise<UserView> {
    try {
      const prismaUser = await this.repository.client.mainUser.create({
        data: { nickname, authUserId },
        select: prismaUserSelect,
      });
      return mapPrismaUserToUserView(prismaUser);
    } catch (e) {
      if (isUniqueConstraintError(e)) {
        throw new DuplicateNicknameException(nickname);
      }
      throw e;
    }
  }

  async updateNickname(id: UserId, nickname: string): Promise<UserView> {
    try {
      const prismaUser = await this.repository.client.mainUser.update({
        where: { id: id.value },
        data: { nickname },
        select: prismaUserSelect,
      });
      return mapPrismaUserToUserView(prismaUser);
    } catch (e) {
      if (isUniqueConstraintError(e)) {
        throw new DuplicateNicknameException(nickname);
      }
      throw e;
    }
  }

  async updateProfileImageUrl(
    id: UserId,
    profileImageUrl: string | null,
  ): Promise<UserView> {
    const prismaUser = await this.repository.client.mainUser.update({
      where: { id: id.value },
      data: { profileImageUrl },
      select: prismaUserSelect,
    });
    return mapPrismaUserToUserView(prismaUser);
  }

  private ensureSystem(): void {
    if (!this.requestContext.isSystem) throw new InvalidAccessException();
  }
}
