import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChannelMemberType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { scrypt } from 'crypto';
import { PrismaService } from '../base/prisma.service';
import { ChannelId, UserId } from '../common/Id';
import { ServiceError } from '../common/ServiceError';
import {
  newServiceFailPrismaUnKnownResponse,
  newServiceFailResponse,
  newServiceFailUnhandledResponse,
  newServiceOkResponse,
  ServiceResponse,
} from '../common/ServiceResponse';
import { DmService } from '../dm/dm.service';
import { MessageWithMemberDto } from '../dm/dto/message-with-member';
import { LeavingChannelInfo } from '../events/event-response.dto';
import { userDtoSelect } from '../users/dto/user.dto';
import {
  createPrismaErrorMessage,
  isPrismaUnknownError,
  isRecordNotFoundError,
  IsRecordToUpdateNotFoundError,
  isUniqueConstraintError,
} from '../util/prismaError';
import { ChangeMemberStatusResultDto } from './dto/change-member-status-result.dto';
import { ChannelMemberDetailDto } from './dto/channel-member-detail.dto';
import {
  ChannelMemberDto,
  channelMemberDtoSelect,
} from './dto/channel-members.dto';
import { channelMessageDtoSelect } from './dto/channel-message.dto';
import { ChannelRelationDto } from './dto/channel-relation.dto';
import { ChannelWithAllInfoDto } from './dto/channel-with-all-info.dto';
import { ChannelWithMembersDto } from './dto/channel-with-members.dto';
import { ChannelDto, channelDtoSelect } from './dto/channel.dto';
import { CreateChannelDto } from './dto/create-channel.dto';
import { JoinedChannelInfoDto } from './dto/joined-channel-info.dto';
import { ChannelType } from './enums/channel-type.enum';

export enum ChangeActionType {
  KICK = 'KICK',
  BANNED = 'BANNED',
  PROMOTE = 'PROMOTE',
  MUTE = 'MUTE',
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
  private logger = new Logger('ChannelService');
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private readonly dmService: DmService,
  ) {}

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

  // TODO: 암호화해서 넣기
  async create(
    id: UserId,
    { type, title, password, capacity }: CreateChannelDto,
  ): Promise<ServiceResponse<ChannelDto>> {
    try {
      if (password) {
        password = await bcrypt.hash(password, 10);
      }
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
      if (
        IsRecordToUpdateNotFoundError(error) ||
        isRecordNotFoundError(error)
      ) {
        throw new BadRequestException(createPrismaErrorMessage(error));
      }
      if (isPrismaUnknownError(error)) {
        throw new InternalServerErrorException(createPrismaErrorMessage(error));
      }
      return newServiceFailPrismaUnKnownResponse(500);
    }
  }

  async channelUpdate(
    id: UserId,
    channelId: ChannelId,
    title: string | undefined,
    isPublic: boolean | undefined,
    maximumMemberCount: number | undefined,
    password: string | undefined | null,
  ): Promise<ServiceResponse<ChannelDto>> {
    try {
      const channel = await this.prisma.channel.findUnique({
        where: { id: channelId.value },
      });

      if (channel === null) {
        throw new ServiceError(
          `유효하지 않은 채널 Id: ${channelId.value}`,
          400,
        );
      }

      const channelMember = await this.prisma.channelMember.findUnique({
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
          `채널에 참여중인 사용자만 채널의 정보를 업데이트 할 수 있습니다.`,
          403,
        );
      }

      if (channel.ownerId !== id.value) {
        throw new ServiceError(
          `채널 소유자만 채널의 정보를 업데이트 할 수 있습니다.`,
          403,
        );
      }

      const result = await this.prisma.channel.update({
        where: { id: channelId.value },
        data: {
          title,
          isPublic,
          createdAt: new Date(),
          maximumMemberCount,
          password: password ? await this.mfaPasswordHash(password) : password,
        },
      });
      return newServiceOkResponse(new ChannelDto(result));
    } catch (error) {
      if (error instanceof ServiceError) {
        this.logger.debug(`채널 참여중 핸들링 되는 에러: ${error.message}`);
        return { ok: false, error };
      }
      this.logger.debug(`채널 참여중 언핸들 에러: ${error}`);
      return newServiceFailUnhandledResponse(400);
    }
  }

  // ChannelMember
  async joinChannel(
    id: UserId,
    channelId: ChannelId,
    password?: string | null,
  ): Promise<ServiceResponse<JoinedChannelInfoDto>> {
    const select = {
      ...channelDtoSelect,
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
    };
    try {
      const info = await this.prisma.$transaction(async (prisma) => {
        const channel = await prisma.channel.findUniqueOrThrow({
          where: {
            id: channelId.value,
          },
          include: {
            members: {
              where: {
                memberId: id.value,
              },
            },
          },
        });

        if (channel.members) {
          if (channel.members[0].memberType !== ChannelMemberType.BANNED) {
            // 이미 들어가 있는 사용자 => 채널 정보만 리턴.
            return await this.getJoinedChannelInfo(id, channelId);
          }
          throw new ServiceError('밴된 유저는 채널에 들어갈 수 없습니다.', 400);
        }

        if (channel.memberCount >= channel.maximumMemberCount) {
          throw new ServiceError('최대 사용자 수 초과', 400);
        }

        if (!channel.isPublic) {
          throw new ServiceError('private 방에는 접속 할 수 없습니다.', 400);
        }

        if (
          channel.password &&
          (!password || !(await bcrypt.compare(password, channel.password)))
        ) {
          throw new ServiceError('올바른 비밀번호 입력이 필요합니다.', 400);
        }

        // prisma.
        await prisma.channelMember.create({
          data: {
            channelId: channelId.value,
            memberId: id.value,
            memberType: ChannelMemberType.MEMBER,
          },
        });
        await this.prisma.channel.update({
          where: { id: channelId.value },
          data: {
            memberCount: {
              increment: 1,
            },
          },
        });
        return await this.getJoinedChannelInfo(id, channelId);
      });

      return newServiceOkResponse(info);
    } catch (error) {
      if (error instanceof ServiceError) {
        return { ok: false, error };
      }
      return newServiceFailUnhandledResponse(400);
    }
  }

  async leaveChannel(
    id: UserId,
    channelId: ChannelId,
  ): Promise<ServiceResponse<LeavingChannelInfo>> {
    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        const deleteResult = await prisma.channelMember.delete({
          where: {
            channelId_memberId: {
              channelId: channelId.value,
              memberId: id.value,
            },
            memberType: { not: ChannelMemberType.BANNED },
          },
          include: {
            member: {
              select: userDtoSelect,
            },
            channel: {
              select: {
                ownerId: true,
              },
            },
          },
        });

        const ownerId =
          deleteResult.channel.ownerId === id.value ? null : undefined;

        // TODO: 채널 멤버카운트가 하나 줄어 0이 되면 어떻게 할까?
        const channel = await prisma.channel.update({
          where: { id: channelId.value },
          data: { ownerId, memberCount: { decrement: 1 } },
        });

        return {
          ...channel,
          member: deleteResult.member,
        };
      });
      return newServiceOkResponse(result);
    } catch (error) {
      if (
        IsRecordToUpdateNotFoundError(error) ||
        isRecordNotFoundError(error)
      ) {
        return newServiceFailResponse(createPrismaErrorMessage(error), 400);
      }
      if (isPrismaUnknownError(error)) {
        return newServiceFailResponse(createPrismaErrorMessage(error), 500);
      }
      return newServiceFailUnhandledResponse(500);
    }
  }

  async changeMemberStatus(
    id: UserId,
    channelId: ChannelId,
    targetId: UserId,
    actionType: ChangeActionType,
  ): Promise<ServiceResponse<ChangeMemberStatusResultDto>> {
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

        const triggerUser = await prisma.channelMember.findUnique({
          where: {
            channelId_memberId: {
              channelId: channelId.value,
              memberId: id.value,
            },
            memberType: {
              not: ChannelMemberType.BANNED,
            },
          },
          include: {
            member: true,
          },
        });

        // 2. 방에 속한 유저만이 행동을 트리거 할 수 있다.
        if (triggerUser === null) {
          throw new ServiceError(
            '방에 존재하지 않는 유저는 kick/ban/promote 할 수 없습니다.',
            400,
          );
        }

        const targetUser = await prisma.channelMember.findUnique({
          where: {
            channelId_memberId: {
              channelId: channelId.value,
              memberId: targetId.value,
            },
            memberType: {
              not: ChannelMemberType.BANNED,
            },
          },
          include: {
            member: true,
          },
        });

        // 3. 방에 속한 유저만이 대상이 될 수 있다.
        if (targetUser === null) {
          throw new ServiceError(
            '방에 존재하지 않는 유저에게 kick/ban/promote 할 수 없습니다.',
            400,
          );
        }

        // this.logger.debug(`triggerUser: ${JSON.stringify(triggerUser)}`);
        // this.logger.debug(`targetUser: ${JSON.stringify(targetUser)}`);

        // 4. Owner는 명령의 대상이 될 수 없음
        const { ownerId } = prismaChannel;
        if (ownerId === targetId.value) {
          throw new ServiceError(
            '방의 Owner를 대상으로 kick/ban/권한변경 할 수 없습니다.',
            400,
          );
        }

        // 5. 오너 여부 체크
        const isOwner = id.value === ownerId;

        // 6. 권한 체크
        if (
          !this.checkPermissions(triggerUser.memberType, actionType, isOwner)
        ) {
          throw new ServiceError(
            `${actionType} 할 수 있는 권한이 존재하지 않습니다.`,
            400,
          );
        }

        // 7. 수행
        if (actionType === ChangeActionType.KICK) {
          await this.kickUser(channelId, targetId);
        } else {
          const memberType =
            actionType === ChangeActionType.BANNED
              ? ChannelMemberType.BANNED
              : actionType === ChangeActionType.PROMOTE
              ? ChannelMemberType.ADMINISTRATOR
              : undefined;
          const mutedUntil =
            actionType === ChangeActionType.MUTE
              ? this.getMutedDateTime()
              : undefined;
          await this.banOrPromoteOrMuteUser(
            channelId,
            targetId,
            memberType,
            mutedUntil,
          );
        }
        return {
          triggerUser: triggerUser.member,
          targetUser: targetUser.member,
          channelId: prismaChannel.id,
          actionType,
        };
      });
      return newServiceOkResponse(result);
    } catch (error) {
      if (error instanceof ServiceError) {
        return { ok: false, error };
      }
      if (
        IsRecordToUpdateNotFoundError(error) ||
        isRecordNotFoundError(error)
      ) {
        throw new BadRequestException(createPrismaErrorMessage(error));
      }
      return newServiceFailUnhandledResponse(500);
    }
  }

  async sendMessage(
    userId: UserId,
    channelId: ChannelId,
    messageJson: string,
  ): Promise<ServiceResponse<MessageWithMemberDto>> {
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
      });
      return newServiceOkResponse(result);
    } catch (error) {
      if (error instanceof ServiceError) {
        return { ok: false, error };
      }
      if (isUniqueConstraintError(error)) {
        throw new ConflictException(createPrismaErrorMessage(error));
      }
      if (
        IsRecordToUpdateNotFoundError(error) ||
        isRecordNotFoundError(error)
      ) {
        throw new BadRequestException(createPrismaErrorMessage(error));
      }
      if (isPrismaUnknownError(error)) {
        throw new InternalServerErrorException(createPrismaErrorMessage(error));
      }
      return newServiceFailPrismaUnKnownResponse(500);
    }
  }

  async findChannelWithMembers(
    channelId: ChannelId,
  ): Promise<ServiceResponse<ChannelWithMembersDto>> {
    try {
      const result = await this.prisma.channel.findUniqueOrThrow({
        where: {
          id: channelId.value,
        },
        select: {
          ...channelDtoSelect,
          password: true,
          members: {
            select: {
              ...channelMemberDtoSelect,
              member: {
                select: userDtoSelect,
              },
            },
          },
        },
      });
      return newServiceOkResponse(new ChannelWithMembersDto(result));
    } catch (error) {
      if (
        IsRecordToUpdateNotFoundError(error) ||
        isRecordNotFoundError(error)
      ) {
        throw new BadRequestException(createPrismaErrorMessage(error));
      }
      if (isPrismaUnknownError(error)) {
        throw new InternalServerErrorException(createPrismaErrorMessage(error));
      }
      return newServiceFailPrismaUnKnownResponse(500);
    }
  }

  async findChannelWithAllInfo(
    channelId: ChannelId,
  ): Promise<ServiceResponse<ChannelWithAllInfoDto>> {
    try {
      const result = await this.prisma.channel.findUniqueOrThrow({
        where: {
          id: channelId.value,
        },
        select: {
          ...channelDtoSelect,
          password: true,
          members: {
            select: {
              ...channelMemberDtoSelect,
              member: {
                select: userDtoSelect,
              },
            },
          },
          messages: {
            select: {
              ...channelMessageDtoSelect,
              member: {
                select: userDtoSelect,
              },
            },
          },
        },
      });
      return newServiceOkResponse(new ChannelWithAllInfoDto(result));
    } catch (error) {
      if (
        IsRecordToUpdateNotFoundError(error) ||
        isRecordNotFoundError(error)
      ) {
        throw new BadRequestException(createPrismaErrorMessage(error));
      }
      if (isPrismaUnknownError(error)) {
        throw new InternalServerErrorException(createPrismaErrorMessage(error));
      }
      return newServiceFailPrismaUnKnownResponse(500);
    }
  }

  async findChannelMembersByChannelId(
    channelId: ChannelId,
  ): Promise<ServiceResponse<ChannelMemberDto[]>> {
    try {
      const result = await this.prisma.channelMember.findMany({
        where: {
          channelId: channelId.value,
        },
        include: {
          member: {
            select: userDtoSelect,
          },
        },
      });
      return newServiceOkResponse(result);
    } catch (error) {
      if (isPrismaUnknownError(error)) {
        throw new InternalServerErrorException(createPrismaErrorMessage(error));
      }
      return newServiceFailPrismaUnKnownResponse(500);
    }
  }

  async getChannelMessages(
    channelId: string,
    userId: UserId,
  ): Promise<ServiceResponse<any[]>> {
    try {
      const blockList = await this.dmService.getBlockUserList(userId);
      let result = await this.prisma.channelMessage.findMany({
        where: {
          channelId: channelId,
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
      return newServiceOkResponse(
        result
          .filter((el) => {
            return !blockList.find(
              (block) => block.followeeId === el.member.id,
            );
          })
          .map((el) => {
            return {
              type: 'channelMessage',
              data: el,
            };
          }),
      );
    } catch (error) {
      if (isPrismaUnknownError(error)) {
        throw new InternalServerErrorException(createPrismaErrorMessage(error));
      }
      return newServiceFailPrismaUnKnownResponse(500);
    }
  }
  // async participate(userId: string, dto: ParticipateChannelDto) {
  //   try {
  //     const channelMember = await this.prisma.channelMember.findUnique({
  //       where: {
  //         channelId_memberId: {
  //           channelId: dto.channelId,
  //           memberId: userId,
  //         },
  //       },
  //     });
  //     if (channelMember?.memberType === ChannelMemberType.BANNED) {
  //       throw new ServiceError('밴된 유저는 방에 들어갈 수 없습니다.', 403);
  //     }
  //     if (channelMember !== null || dto.type == ChannelType.Public)
  //       // 이미 방에 들어가 있거나, 퍼블릭방.
  //       return await this.participateUserToChannel(
  //         idOf(userId),
  //         idOf(dto.channelId),
  //       );

  //     if (!dto.password) throw new ServiceError('비밀번호가 필요합니다.', 400);
  //     const channel = await this.prisma.channel.findUnique({
  //       where: {
  //         id: dto.channelId,
  //       },
  //     });
  //     if (!channel?.password)
  //       throw new ServiceError('비밀번호가 없습니다.', 403);
  //     const match = await bcrypt.compare(dto.password, channel.password);
  //     if (!match) {
  //       throw new ServiceError('비밀번호가 틀렸습니다.', 400);
  //     }
  //     return await this.participateUserToChannel(
  //       idOf(userId),
  //       idOf(dto.channelId),
  //     );
  //   } catch (error) {
  //     if (error instanceof ServiceError) {
  //       throw new HttpException(error.message, error.statusCode);
  //     }
  //     if (error instanceof PrismaClientKnownRequestError) {
  //       this.logger.debug(error.code);
  //     }
  //     if (
  //       isUniqueConstraintError(error) ||
  //       isRecordNotFoundError(error) ||
  //       IsRecordToUpdateNotFoundError(error) ||
  //       IsForeignKeyConstraintFailError(error)
  //     ) {
  //       this.logger.debug(
  //         `잘못된 입력으로 인한 프리즈마 에러${
  //           error.code
  //         } 발생: ${createPrismaErrorMessage(error)}`,
  //       );
  //       throw new BadRequestException(createPrismaErrorMessage(error));
  //     }
  //     throw new InternalServerErrorException('Unknown Error');
  //   }
  // }

  private async checkUserAlreadyInChannel(userId: string, channelId: string) {
    const result = await this.prisma.channelMember.findFirst({
      where: {
        channelId: channelId,
        memberId: userId,
      },
    });
    if (result) return true;
    else return false;
  }

  private async getJoinedChannelInfo(
    userId: UserId,
    channelId: ChannelId,
  ): Promise<JoinedChannelInfoDto> {
    const channelMember = await this.prisma.channelMember.findUniqueOrThrow({
      where: {
        channelId_memberId: {
          channelId: channelId.value,
          memberId: userId.value,
        },
      },
    });
    const result = await this.prisma.channel.findUniqueOrThrow({
      where: { id: channelId.value },
      include: {
        members: {
          include: {
            member: {
              select: userDtoSelect,
            },
          },
        },
        messages: {
          include: {
            member: {
              select: userDtoSelect,
            },
          },
        },
      },
    });
    const channel = {
      id: result.id,
      title: result.title,
      isPublic: result.isPublic,
      needPassword: result.password !== null,
      createdAt: result.createdAt,
      lastActiveAt: result.lastActiveAt,
      ownerId: result.ownerId,
      memberCount: result.memberCount,
      maximumMemberCount: result.maximumMemberCount,
    };
    return {
      channelMember,
      channel,
      members: result.members,
      messages: result.messages,
    };
  }

  private async kickUser(
    channelId: ChannelId,
    targetId: UserId,
  ): Promise<ServiceResponse<ChannelMemberDetailDto>> {
    try {
      const result = await this.prisma.channelMember.delete({
        where: {
          channelId_memberId: {
            channelId: channelId.value,
            memberId: targetId.value,
          },
        },
        include: {
          member: {
            select: userDtoSelect,
          },
        },
      });
      return newServiceOkResponse(result);
    } catch (error) {
      if (
        isRecordNotFoundError(error) ||
        IsRecordToUpdateNotFoundError(error)
      ) {
        this.logger.log(
          `kickUser 시도가 레코드 없음으로 실패: ${error.message}`,
        );
        return newServiceFailResponse(error.message, 400);
      }
      this.logger.debug(
        `예상치 못 한 banOrPromoteOrMuteUser 시도의 실패: ${error}`,
      );
      return newServiceFailUnhandledResponse(500);
    }
  }

  private async banOrPromoteOrMuteUser(
    channelId: ChannelId,
    targetId: UserId,
    memberType: ChannelMemberType | undefined,
    mutedUntil: Date | undefined,
  ): Promise<ServiceResponse<ChannelMemberDetailDto>> {
    try {
      const result = await this.prisma.channelMember.update({
        where: {
          channelId_memberId: {
            channelId: channelId.value,
            memberId: targetId.value,
          },
        },
        include: {
          member: {
            select: userDtoSelect,
          },
        },
        data: { memberType, mutedUntil },
      });
      return newServiceOkResponse(result);
    } catch (error) {
      if (
        isRecordNotFoundError(error) ||
        IsRecordToUpdateNotFoundError(error)
      ) {
        this.logger.log(
          `banOrPromoteOrMuteUser 시도가 레코드 없음으로 실패: ${error.message}`,
        );
        return newServiceFailResponse(error.message, 400);
      }
      this.logger.debug(
        `예상치 못 한 banOrPromoteOrMuteUser 시도의 실패: ${error}`,
      );
      return newServiceFailUnhandledResponse(500);
    }
  }

  private getMutedDateTime() {
    const THREE_MINUTE = 3;
    const SECONDS_IN_MINUTES = 60;
    const MILLI_SECONDS_IN_SECONDS = 1000;
    return new Date(
      Date.now() + THREE_MINUTE * SECONDS_IN_MINUTES * MILLI_SECONDS_IN_SECONDS,
    );
  }

  private checkPermissions(
    type: ChannelMemberType,
    actionType: ChangeActionType,
    isOwner: boolean,
  ) {
    return actionType === ChangeActionType.PROMOTE
      ? this.checkPromotePermission(isOwner)
      : this.checkKickBanMutePermissions(type);
  }
  private checkKickBanMutePermissions(type: ChannelMemberType) {
    return type === ChannelMemberType.ADMINISTRATOR;
  }
  private checkPromotePermission(isOwner: boolean) {
    return isOwner;
  }
  private isUserInChannel(type: ChannelMemberType) {
    return type !== ChannelMemberType.BANNED;
  }
  private mfaPasswordHash(password: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      scrypt(
        password,
        this.configService.getOrThrow<string>('PASSWORD_SALT'),
        32,
        (err, buffer) => {
          if (err) reject(err);
          else resolve(buffer.toString());
        },
      );
    });
  }
}
