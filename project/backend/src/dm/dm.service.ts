import { Injectable, Logger } from '@nestjs/common';
import { DMChannelAssociation, DMMessage } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../base/prisma.service';
import { idOf, UserId } from '../common/Id';
import {
  newServiceFailPrismaKnownResponse,
  newServiceFailResponse,
  newServiceOkResponse,
  ServiceResponse,
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
  ): Promise<ServiceResponse<MessageWithMemberDto[]>> {
    try {
      const targetUser = await this.prisma.user.findUniqueOrThrow({
        where: { nickname },
      });
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
          });
        },
      );
      return newServiceOkResponse(result);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        return newServiceFailPrismaKnownResponse(error.code, 400);
      }
      return newServiceFailResponse('Unknown Error', 500);
    }
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
