import { Injectable } from '@nestjs/common';
import { DMChannelAssociation, DMMessage } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../base/prisma.service';
import { UserId } from '../common/Id';
import {
  newServiceFailPrismaKnownResponse,
  newServiceFailResponse,
  newServiceOkResponse,
  ServiceResponse,
} from '../common/ServiceResponse';

@Injectable()
export class DmService {
  constructor(private prisma: PrismaService) {}

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
      return newServiceOkResponse(prismaDmChannelAssociation);
    } catch (error) {
      return newServiceFailResponse('Unknown Error', 500);
    }
  }

  async createDm(
    userId: UserId,
    targetId: UserId,
    messageJson: string,
  ): Promise<ServiceResponse<DMMessage>> {
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
          member1: {
            select: {
              id: true,
            },
          }, // 둘 중 내꺼 아닌것 하나.
          member2: { select: userSelect }, // 둘 중 내꺼 아닌것 하나.
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
