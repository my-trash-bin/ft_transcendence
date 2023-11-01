import { v4 } from 'uuid';
import { Imports } from '../../../Imports';
import { Repository } from '../../../base/Repository';
import { InvalidIdException } from '../../../exception/InvalidIdException';
import { invalidId } from '../../../exception/invalidId';
import { Resolver } from '../../../util/di/Container';
import { getId } from '../../../util/id/getId';
import { isUniqueConstraintError } from '../../../util/isUniqueConstraintError';
import { sortAs } from '../../../util/sortAs';
import { IUserService } from '../../interface/User/IUserService';
import { DuplicateNicknameException } from '../../interface/User/exception/DuplicateNicknameException';
import { UserId, UserView } from '../../interface/User/view/UserView';
import { mapPrismaUserToUserView } from './mapPrismaUserToUserView';
import { prismaUserSelect } from './prismaUserSelect';

export class UserService implements IUserService {
  private readonly repository: Repository;
  constructor(resolve: Resolver<Imports>) {
    this.repository = resolve('repository');
  }

  async getMany(
    ids: readonly UserId[],
  ): Promise<(UserView | InvalidIdException)[]> {
    const stringIds = ids.map(({ value }) => value);
    const prismaUsers = await this.repository.client.user.findMany({
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
      const id = v4();
      const prismaUser = await this.repository.client.user.create({
        data: { id, nickname },
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
      const prismaUser = await this.repository.client.user.update({
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
    const prismaUser = await this.repository.client.user.update({
      where: { id: id.value },
      data: { profileImageUrl },
      select: prismaUserSelect,
    });
    return mapPrismaUserToUserView(prismaUser);
  }

  async delete(id: UserId): Promise<void> {
    await this.repository.client.user.update({
      where: { id: id.value },
      data: { isLeaved: true, leavedAt: new Date(), nickname: v4() },
      select: { id: true },
    });
  }
}
