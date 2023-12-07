import { Injectable, Logger } from '@nestjs/common';
import { DMChannelAssociation, DMMessage, Prisma } from '@prisma/client';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../base/prisma.service';
import { UserId, idOf } from '../common/Id';
import {
  ServiceResponse,
  newServiceFailPrismaKnownResponse,
  newServiceFailResponse,
  newServiceOkResponse,
} from '../common/ServiceResponse';
import { userDtoSelect } from '../users/dto/user.dto';
import { MessageWithMemberDto } from './dto/message-with-member';

@Injectable()
export class DmService {
  private logger = new Logger('DmService');
  constructor(private prisma: PrismaService) {}

  async findAllDmChannels() {
    return await this.prisma.dMChannelAssociation.findMany({
      include: { DMMessage: true },
    });
  }
  async findOrCraeteDmChannel(
    member1Id: UserId,
    member2Id: UserId,
  ): Promise<ServiceResponse<DMChannelAssociation>> {
    const swapId = (a: UserId, b: UserId) =>
      a.value > b.value ? [b, a] : [a, b];
    [member1Id, member2Id] = swapId(member1Id, member2Id);
    try {
      const prismaDmChannelAssociation =
        await this.prisma.dMChannelAssociation.upsert({
          where: {
            member1Id_member2Id: {
              member1Id: member1Id.value,
              member2Id: member2Id.value,
            },
          },
          update: {},
          create: {
            member1Id: member1Id.value,
            member2Id: member2Id.value,
          },
        });
      this.logger.debug('ok');
      return newServiceOkResponse(prismaDmChannelAssociation);
    } catch (error) {
      this.logger.debug('fail');
      return newServiceFailResponse('Unknown Error', 500);
    }
  }

  async createDm(
    userId: UserId,
    targetId: UserId,
    messageJson: string,
  ): Promise<ServiceResponse<MessageWithMemberDto>> {
    const result = await this.findOrCraeteDmChannel(userId, targetId);
    if (!result.ok) {
      return { ok: false, error: result.error };
    }
    const prismaDmChannelAssociation = result.data!;
    try {
      const prismaDmMessage = await this.prisma.dMMessage.create({
        data: {
          channelId: prismaDmChannelAssociation.id,
          memberId: userId.value,
          messageJson: messageJson,
        },
        include: {
          member: {
            select: {
              id: true,
              nickname: true,
              profileImageUrl: true,
              joinedAt: true,
              isLeaved: true,
              leavedAt: true,
              statusMessage: true,
            },
          },
        },
      });
      return newServiceOkResponse(prismaDmMessage);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        return newServiceFailPrismaKnownResponse(error.code, 400);
      }
      return newServiceFailResponse('Unknown Error', 500);
    }
  }

  async getDMChannelMessages(
    userId: UserId,
    targetId: UserId,
  ): Promise<ServiceResponse<DMMessage[]>> {
    const result = await this.findOrCraeteDmChannel(userId, targetId);
    if (!result.ok) {
      return { ok: false, error: result.error };
    }
    try {
      const prismaDmMessages = await this.prisma.dMMessage.findMany({
        where: {
          channelId: result.data!.id,
        },
      });
      return newServiceOkResponse(prismaDmMessages);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        return newServiceFailPrismaKnownResponse(error.code, 400);
      }
      return newServiceFailResponse('Unknown Error', 500);
    }
  }

  async getDMChannelMessagesByNickname(
    userId: UserId,
    nickname: string,
  ): Promise<ServiceResponse<any[]>> {
    try {
      const targetUser = await this.prisma.user.findUniqueOrThrow({
        where: { nickname },
      });
      const blockList = await this.getBlockUserList(userId.value);
      const isBlock = blockList.find((el) => el.followeeId === targetUser.id);
      if (isBlock) return newServiceOkResponse([]);
      const channelResult = await this.findOrCraeteDmChannel(
        userId,
        idOf(targetUser.id),
      );
      if (!channelResult.ok) {
        return { ok: false, error: channelResult.error };
      }
      const result = await this.prisma.$transaction(
        async (prismaTransaction) => {
          const channelId = channelResult.data!.id;
          return await prismaTransaction.dMMessage.findMany({
            where: {
              channelId,
            },
            include: {
              member: {
                select: userDtoSelect,
              },
            },
            orderBy: {
              sentAt: 'asc',
            },
          });
        },
      );
      return newServiceOkResponse(
        result.map((el) => {
          return {
            type: 'directMessage',
            data: el,
          };
        }),
      );
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        return newServiceFailPrismaKnownResponse(error.code, 400);
      }
      return newServiceFailResponse('Unknown Error', 500);
    }
  }

  async getMyDmList(userId: string) {
    try {
      const dmChannelIds = await this.prisma.dMChannelAssociation.findMany({
        where: {
          OR: [{ member1Id: userId }, { member2Id: userId }],
        },
        select: {
          id: true,
        },
      });
      if (dmChannelIds.length === 0) return [];
      const channelIdList = dmChannelIds.map(({ id }) => id);

      let result: any = await this.getDmMessages(channelIdList);
      const otherUserId = result.map((el: any) => {
        if (el.member1Id === userId) {
          return el.member2Id;
        } else return el.member1Id;
      });

      const otherUsers = await this.prisma.user.findMany({
        where: {
          id: {
            in: otherUserId,
          },
        },
      });
      const blockList = await this.getBlockUserList(userId);

      const userProfileMap = new Map();
      otherUsers.map((el) => {
        userProfileMap.set(el.id, el);
      });

      //filter block user
      result = result.filter((el: any) => {
        const isBlock = blockList.find((block) => block.followeeId === el.id);
        if (isBlock) return false;
        else return true;
      });
      return result.map((el: any) => {
        const otherUserId =
          el.member1Id === userId ? el.member2Id : el.member1Id;
        return {
          channelId: el.channelId,
          sentAt: el.sentAt,
          messagePreview: el.messageJson,
          profileImage: userProfileMap.get(otherUserId).profileImageUrl,
          nickname: userProfileMap.get(otherUserId).nickname,
        };
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        return newServiceFailPrismaKnownResponse(error.code, 400);
      }
      return newServiceFailResponse('Unknown Error', 500);
    }
  }

  async canSendDm(nickname: string, userId: string) {
    try {
      const targetUser = await this.prisma.user.findUniqueOrThrow({
        where: { nickname },
      });
      if (!targetUser) return false;
      const blockList = await this.getBlockUserList(userId);
      const isBlock = blockList.find((el) => el.followeeId === targetUser.id);
      if (isBlock) return false;
      return true;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        return false;
      }
      return false;
    }
  }

  private async getDmMessages(channelIdList: string[]) {
    return await this.prisma.$queryRaw`SELECT DISTINCT ON ("channelId") *
    FROM "DMMessage"
    JOIN "DMChannelAssociation" ON "DMMessage"."channelId" = "DMChannelAssociation"."id"
    JOIN "User" ON "DMChannelAssociation"."member1Id" = "User"."id"
    WHERE "channelId" = ANY (${Prisma.sql`ARRAY[${Prisma.join(
      channelIdList,
      ', ',
    )}]::uuid[]`})
    ORDER BY "channelId", "sentAt" DESC`;
  }

  async getBlockUserList(userId: string) {
    const res = await this.prisma.userFollow.findMany({
      where: {
        followerId: userId,
      },
    });
    return res.filter((el) => el.isBlock);
  }

  // async getDMChannelMessages(
  //   userId: UserId,
  //   targetId: UserId,
  // ): Promise<ServiceResponse<DMMessage[]>> {
  //   const result = await this.findOrCraeteDmChannel(userId, targetId);
  //   if (!result.ok) {
  //     return { ok: false, error: result.error };
  //   }
  //   try {
  //     const prismaDmMessages = await this.prisma.dMMessage.findMany({
  //       where: {
  //         channelId: result.data!.id,
  //       },
  //     });
  //     return newServiceOkResponse(prismaDmMessages);
  //   } catch (error) {
  //     if (error instanceof PrismaClientKnownRequestError) {
  //       return newServiceFailPrismaKnownResponse(error.code, 400);
  //     }
  //     return newServiceFailResponse('Unknown Error', 500);
  //   }
  // }

  async getDMChannelsWithMessages(userId: UserId, take?: number) {
    const userSelect = {
      id: true,
      mfaPasswordHash: false,
      joinedAt: true,
      isLeaved: true,
      leavedAt: true,
      nickname: true,
      profileImageUrl: true,
      statusMessage: true,
    };
    const dmMessageSelect = {
      id: true,
      channelId: false,
      memberId: false,
      sentAt: true,
      messageJson: true,
    };
    const associationsWithMessages =
      await this.prisma.dMChannelAssociation.findMany({
        where: {
          OR: [{ member1Id: userId.value }, { member2Id: userId.value }],
        },
        select: {
          id: true,
          member1: { select: userSelect },
          member2: { select: userSelect },
          DMMessage: {
            take,
            orderBy: {
              sentAt: 'desc',
            },
            select: dmMessageSelect,
          },
        },
      });
    return associationsWithMessages;
  }
}
// id          String   @id @default(uuid()) @db.Uuid
// channelId   String   @db.Uuid
// memberId    String   @db.Uuid
// sentAt      DateTime @default(now())
// messageJson String
