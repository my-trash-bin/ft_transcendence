import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { PrismaService } from '../../../base/PrismaService';
import { InvalidIdException } from '../../../base/common/InvalidIdException';
import { invalidId } from '../../../base/common/invalidId';
import { isUniqueConstraintError } from '../../../base/common/isUniqueConstraintError';
import { getId } from '../../util/id/getId';
import { sortAs } from '../../util/sortAs';
import { UserId, UserView } from './UserView';
import { DuplicateNicknameException } from './exception/DuplicateNicknameException';
import { mapPrismaUserToUserView } from './mapPrismaUserToUserView';
import { prismaUserSelect } from './prismaUserSelect';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getMany(
    ids: readonly UserId[],
  ): Promise<(UserView | InvalidIdException)[]> {
    const stringIds = ids.map(({ value }) => value);
    const prismaUsers = await this.prismaService.user.findMany({
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
      const prismaUser = await this.prismaService.user.create({
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
      const prismaUser = await this.prismaService.user.update({
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
    const prismaUser = await this.prismaService.user.update({
      where: { id: id.value },
      data: { profileImageUrl },
      select: prismaUserSelect,
    });
    return mapPrismaUserToUserView(prismaUser);
  }

  async delete(id: UserId): Promise<void> {
    await this.prismaService.user.update({
      where: { id: id.value },
      data: { isLeaved: true, leavedAt: new Date(), nickname: v4() },
      select: { id: true },
    });
  }
}
