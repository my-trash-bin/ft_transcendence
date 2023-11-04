import { Resolver } from '@ft_transcendence/common/di/Container';
import { getId } from '../../../util/id/getId';
import { sortAs } from '../../../util/sortAs';
import { ApplicationImports } from '../../ApplicationImports';
import { RequestContext } from '../../RequestContext';
import { InvalidIdException } from '../../exception/InvalidIdException';
import { IRepository } from '../../interface/IRepository';
import { IUserService } from '../../interface/User/IUserService';
import { DuplicateNicknameException } from '../../interface/User/exception/DuplicateNicknameException';
import { UserId, UserView } from '../../interface/User/view/UserView';
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

  async create(nickname: string): Promise<UserView> {
    try {
      const tempAuthUserId = '123';
      const prismaUser = await this.repository.client.mainUser.create({
        data: { nickname, authUserId: tempAuthUserId },
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
}
