import { Injectable } from '@nestjs/common';
import {
  Channel,
  ChannelMember,
  ChannelMemberType,
  ChannelMessage,
  Prisma,
} from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../base/prisma.service';
import { ChannelId, UserId } from '../common/Id';
import { ServiceError } from '../common/ServiceError';
import {
  newServiceFailPrismaKnownResponse,
  newServiceFailPrismaUnKnownResponse,
  newServiceOkResponse,
  ServiceResponse,
} from '../common/ServiceResponse';
import { ChannelDto } from './dto/channel-dto';
import { ChannelMemberDto } from './dto/channel-members.dto';
import { ChannelRelationDto } from './dto/channel-relation.dto';
import { CreateChannelDto } from './dto/create-channel.dto';
import { ChannelType } from './enums/channel-type.enum';

export enum ChangeActionType {
  KICK = 'KICK',
  BANNED = 'BANNED',
  PROMOTE = 'PROMOTE',
}

export type JoinChannelInfoType = {
  id: string;
  title: string;
  isPublic: boolean;
  createdAt: Date;
  lastActiveAt: Date;
  ownerId: string | null;
  memberCount: number;
  maximumMemberCount: number;
  members: {
    memberId: string;
    memberType: ChannelMemberType;
    mutedUntil: Date;
    member: {
      id: string;
      nickname: string;
      profileImageUrl: string | null;
    };
  }[];
};

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}

  // Channel
  async findAll() {
    const prismaChannels = await this.prisma.channel.findMany();
    return prismaChannels.map((prismaChannel) => new ChannelDto(prismaChannel));
  }

  async findAllChannelMembers() {
    const prismaChannels = await this.prisma.channelMember.findMany();
    return prismaChannels;
  }

  async findOne(id: ChannelId) {
    const prismaChannel = await this.prisma.channel.findUnique({
      where: { id: id.value },
    });
    return prismaChannel ? new ChannelDto(prismaChannel) : null;
  }

  async findByUser(id: UserId) {
    const prismaChannelRelations = await this.prisma.channelMember.findMany({
      where: { memberId: id.value },
      select: {
        memberType: true,
        mutedUntil: true,
        channel: true,
      },
    });
    return prismaChannelRelations.map((el) => new ChannelRelationDto(el));
  }

  async create(
    id: UserId,
    { type, title, password, capacity }: CreateChannelDto,
  ): Promise<ServiceResponse<ChannelDto>> {
    try {
      const prismaChannel = await this.prisma.channel.create({
        data: {
          title,
          isPublic: type === ChannelType.Public,
          password,
          maximumMemberCount: capacity,
          ownerId: id.value,
          memberCount: 1,
          members: {
            create: [
              {
                memberId: id.value,
                memberType: ChannelMemberType.ADMINISTRATOR,
              },
            ],
          },
        },
      });
      return newServiceOkResponse(new ChannelDto(prismaChannel));
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        return newServiceFailPrismaKnownResponse(error.code, 400);
      }
      return newServiceFailPrismaUnKnownResponse(500);
    }
  }

  // ChannelMember
  async joinChannel(
    id: UserId,
    channelId: ChannelId,
  ): Promise<ServiceResponse<JoinChannelInfoType>> {
    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        const channelMember = await prisma.channelMember.findUnique({
          where: {
            channelId_memberId: {
              channelId: channelId.value,
              memberId: id.value,
            },
          },
        });
        if (channelMember !== null) {
          throw new ServiceError(
            channelMember.memberType === ChannelMemberType.BANNED
              ? '밴된 유저는 채널에 들어갈 수 없습니다.'
              : '이미 해당 채널에 들어가 있습니다.',
            400,
          );
        }

        const channel = await prisma.channel.findUniqueOrThrow({
          where: { id: channelId.value },
        });

        // TODO: 사용자 수가 0일떄는?
        if (channel.memberCount >= channel.maximumMemberCount) {
          throw new ServiceError('최대 사용자 수 초과', 400);
        }

        await prisma.channelMember.create({
          data: {
            channelId: channelId.value,
            memberId: id.value,
            memberType: ChannelMemberType.MEMBER,
          },
        });

        return prisma.channel.update({
          where: { id: channelId.value },
          data: {
            memberCount: {
              increment: 1,
            },
          },
          select: {
            id: true,
            title: true,
            isPublic: true,
            createdAt: true,
            lastActiveAt: true,
            ownerId: true,
            memberCount: true,
            maximumMemberCount: true,
            members: {
              select: {
                memberId: true,
                memberType: true,
                mutedUntil: true,
                member: {
                  select: {
                    id: true,
                    nickname: true,
                    profileImageUrl: true,
                  },
                },
              },
            },
          },
        });
      });
      return newServiceOkResponse(result);
    } catch (error) {
      if (error instanceof ServiceError) {
        return { ok: false, error };
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return newServiceFailPrismaKnownResponse(error.code, 400);
      }
      return newServiceFailPrismaUnKnownResponse(500);
    }
  }

  async leaveChannel(
    id: UserId,
    channelId: ChannelId,
  ): Promise<ServiceResponse<Channel>> {
    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        const channelMember = await prisma.channelMember.findUnique({
          where: {
            channelId_memberId: {
              channelId: channelId.value,
              memberId: id.value,
            },
          },
        });
        if (
          channelMember === null ||
          channelMember.memberType === ChannelMemberType.BANNED
        ) {
          throw new ServiceError(
            '채널에 들어가있지 않은 유저의 나가기 요청은 유효하지 않습니다.',
            400,
          );
        }

        await prisma.channelMember.delete({
          where: {
            channelId_memberId: {
              channelId: channelId.value,
              memberId: id.value,
            },
          },
        });

        // TODO: owner를 굳이 지울 필요가?
        const ownerId =
          channelMember.memberType === ChannelMemberType.ADMINISTRATOR
            ? null
            : undefined;

        // TODO: 채널 멤버카운트가 하나 줄어 0이 되면 어떻게 할까?
        return await prisma.channel.update({
          where: { id: channelId.value },
          data: { ownerId, memberCount: { decrement: 1 } },
        });
      });
      return newServiceOkResponse(result);
    } catch (error) {
      return newServiceFailPrismaKnownResponse('Unknown Error', 500);
    }
  }

  async changeMemberStatus(
    id: UserId,
    channelId: ChannelId,
    targetId: UserId,
    actionType: ChangeActionType,
    // { type, title, password, capacity }: CreateChannelDto,
  ): Promise<ServiceResponse<ChannelMember>> {
    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        // 유저가 그 방의 ADMINISTRATOR 여야 하고, 상대가 방에 있는 OWNER가 아닌 유저
        const prismaChannel = await prisma.channel.findUnique({
          where: { id: channelId.value },
        });
        // 1. 올바른 채널 ID
        if (prismaChannel === null) {
          throw new ServiceError('Invalid channelId', 400);
        }
        // 2. Owner는 명령의 대상이 될 수 없음
        const { ownerId } = prismaChannel;
        if (ownerId === targetId.value) {
          throw new ServiceError(
            '방의 Owner를 대상으로 kick/ban/권한변경 할 수 없습니다.',
            400,
          );
        }
        const user = await prisma.channelMember.findUnique({
          where: {
            channelId_memberId: {
              channelId: channelId.value,
              memberId: id.value,
            },
          },
        });
        // 3. 방에 속한 유저만이 행동 할 수 있다.
        if (user === null) {
          throw new ServiceError(
            '방에 존재하지 않는 유저는 kick/ban/promote 할 수 없습니다.',
            400,
          );
        }
        // 4. 오너 여부 체크
        const isOwner = user.memberId === ownerId;
        // 5. 권한 체크
        if (this.checkPermissions(user.memberType, actionType, isOwner)) {
          throw new ServiceError(
            `${actionType} 할 수 있는 권한이 존재하지 않습니다.`,
            400,
          );
        }
        // 6. 수행
        if (actionType === ChangeActionType.KICK) {
          return await this.kickUser(channelId, targetId);
        } else {
          const changedType =
            actionType === ChangeActionType.BANNED
              ? ChannelMemberType.BANNED
              : ChannelMemberType.ADMINISTRATOR;
          return await this.banOrPromoteUser(channelId, targetId, changedType);
        }
      });
      return newServiceOkResponse(result);
    } catch (error) {
      if (error instanceof ServiceError) {
        return { ok: false, error };
      }
      if (error instanceof PrismaClientKnownRequestError) {
        return newServiceFailPrismaKnownResponse(error.code, 400);
      }
      return newServiceFailPrismaUnKnownResponse(500);
    }
  }

  async sendMessage(
    userId: UserId,
    channelId: ChannelId,
    messageJson: string,
  ): Promise<ServiceResponse<ChannelMessage>> {
    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        const prismaChannel = await prisma.channel.findUnique({
          where: { id: channelId.value },
          select: {
            id: true,
            members: {
              where: {
                channelId: channelId.value,
                memberId: userId.value,
              },
              select: {
                channelId: true,
                memberId: true,
                memberType: true,
                mutedUntil: true,
              },
              take: 1,
            },
          },
        });
        // 1. 올바른 채널 ID
        if (prismaChannel === null) {
          throw new ServiceError('유효하지 않은 channelId', 400);
        }
        // 2. 방에 속한 유저만이 행동 할 수 있다.
        const user = prismaChannel.members ? prismaChannel.members[0] : null;
        if (!user || user.memberType === ChannelMemberType.BANNED) {
          throw new ServiceError('채널에 속하지 않은 유저입니다.', 400);
        }
        if (new Date(user.mutedUntil) > new Date()) {
          throw new ServiceError('뮤트 상태의 유저입니다.', 400);
        }
        return await prisma.channelMessage.create({
          data: {
            channelId: channelId.value,
            memberId: userId.value,
            messageJson: messageJson,
          },
        });
      });
      return newServiceOkResponse(result);
    } catch (error) {
      if (error instanceof ServiceError) {
        return { ok: false, error };
      }
      if (error instanceof PrismaClientKnownRequestError) {
        return newServiceFailPrismaKnownResponse(error.code, 400);
      }
      return newServiceFailPrismaUnKnownResponse(500);
    }
  }

  async findChannelMembersByChannelId(
    channelId: ChannelId,
  ): Promise<ServiceResponse<ChannelMemberDto[]>> {
    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        return await this.prisma.channelMember.findMany({
          where: {
            channelId: channelId.value,
          },
          include: {
            member: {
              select: {
                id: true,
                joinedAt: true,
                isLeaved: true,
                leavedAt: true,
                nickname: true,
                profileImageUrl: true,
                statusMessage: true,
              },
            },
          },
        });
      });
      return newServiceOkResponse(result);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        return newServiceFailPrismaKnownResponse(error.code, 400);
      }
      return newServiceFailPrismaUnKnownResponse(500);
    }
  }

  private async kickUser(channelId: ChannelId, targetId: UserId) {
    const result = await this.prisma.channelMember.delete({
      where: {
        channelId_memberId: {
          channelId: channelId.value,
          memberId: targetId.value,
        },
      },
    });
    return result;
  }

  private async banOrPromoteUser(
    channelId: ChannelId,
    targetId: UserId,
    memberType: ChannelMemberType,
  ) {
    const result = await this.prisma.channelMember.update({
      where: {
        channelId_memberId: {
          channelId: channelId.value,
          memberId: targetId.value,
        },
      },
      data: { memberType },
    });
    return result;
  }

  private checkPermissions(
    type: ChannelMemberType,
    actionType: ChangeActionType,
    isOwner: boolean,
  ) {
    return actionType === ChangeActionType.PROMOTE
      ? this.checkPromotePermission(isOwner)
      : this.checkKickBanPermissions(type);
  }
  private checkKickBanPermissions(type: ChannelMemberType) {
    return type === ChannelMemberType.ADMINISTRATOR;
  }
  private checkPromotePermission(isOwner: boolean) {
    return isOwner;
  }
  private isUserInChannel(type: ChannelMemberType) {
    return type !== ChannelMemberType.BANNED;
  }
}
