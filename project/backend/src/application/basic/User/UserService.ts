import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { v4 } from 'uuid';
import { PrismaService } from '../../../base/PrismaService';
import { UserUpdateNicknameResultView } from './UserUpdateNicknameResultView';
import { UserId, UserView } from './UserView';
import { mapPrismaUserToUserView } from './mapPrismaUserToUserView';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(nickname: string): Promise<UserView> {
    const id = v4();
    const prismaUser = await this.prismaService.user.create({
      data: { id, nickname },
    });
    return mapPrismaUserToUserView(prismaUser);
  }

  async updateNickname(
    id: UserId,
    nickname: string,
  ): Promise<UserUpdateNicknameResultView> {
    try {
      const prismaUser = await this.prismaService.user.update({
        where: { id: id.value },
        data: { nickname },
      });
      return { succeeded: true, userView: mapPrismaUserToUserView(prismaUser) };
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        return { succeeded: false };
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
    });
    return mapPrismaUserToUserView(prismaUser);
  }

  async deleteUser(id: UserId): Promise<void> {
    await this.prismaService.user.update({
      where: { id: id.value },
      data: { isLeaved: true, leavedAt: new Date() },
      select: { id: true },
    });
  }
}
