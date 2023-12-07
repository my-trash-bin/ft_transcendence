import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChannelMemberType, Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcrypt';
import { scrypt } from 'crypto';
import { PrismaService } from '../base/prisma.service';
import { ChannelId, UserId } from '../common/Id';
import { ServiceError } from '../common/ServiceError';
import {
  ServiceResponse,
  newServiceFailPrismaUnKnownResponse,
  newServiceFailResponse,
  newServiceFailUnhandledResponse,
  newServiceOkResponse,
} from '../common/ServiceResponse';
import { DmService } from '../dm/dm.service';
import { MessageWithMemberDto } from '../dm/dto/message-with-member';
import { UserDto, userDtoSelect } from '../users/dto/user.dto';
import {
  IsForeignKeyConstraintFailError,
  IsRecordToUpdateNotFoundError,
  createPrismaErrorMessage,
  isPrismaUnknownError,
  isRecordNotFoundError,
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
import { JoinedChannelInfoDto } from './dto/joined-channel-info.dto';
import { LeavingChannelResponseDto } from './dto/leave-channel-response.dto';

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

export type TransactionPrismaType = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

@Injectable()
export class ChannelService {
  private readonly logger = new Logger('ChannelService');
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly dmService: DmService,
  ) {}

  // Channel
  async findAll() {
    const prismaChannels = await this.prismaService.channel.findMany();
    return prismaChannels.map((prismaChannel) => new ChannelDto(prismaChannel));
  }

  async findAllChannelMembers() {
    const prismaChannels = await this.prismaService.channelMember.findMany();
    return prismaChannels;
  }

  async findOne(id: ChannelId) {
    const prismaChannel = await this.prismaService.channel.findUnique({
      where: { id: id.value },
    });
    return prismaChannel ? new ChannelDto(prismaChannel) : null;
  }

  async findByUser(id: UserId) {
    const prismaChannelRelations =
      await this.prismaService.channelMember.findMany({
        where: {
          memberId: id.value,
          memberType: { not: ChannelMemberType.BANNED },
        },
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
    isPublic: boolean,
    title: string,
    password: string | null | undefined,
    maximumMemberCount: number,
  ): Promise<ServiceResponse<ChannelDto>> {
    try {
      if (password) {
        password = await bcrypt.hash(password, 10);
      }
      const prismaChannel = await this.prismaService.channel.create({
        data: {
          title,
          isPublic,
          password,
          maximumMemberCount,
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
        throw new BadRequestException(createPrismaErrorMessage(error)); // create의 id가 잘못된 경우
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
      const channel = await this.prismaService.channel.findUnique({
        where: { id: channelId.value },
      });

      if (channel === null) {
        throw new ServiceError(
          `유효하지 않은 채널 Id: ${channelId.value}`,
          400,
        );
      }

      const channelMember = await this.prismaService.channelMember.findUnique({
        where: {
          channelId_memberId: {
            channelId: channelId.value,
            memberId: id.value,
          },
        },
      });

      if (this.isUserInChannel(channelMember)) {
        throw new ServiceError(
          `채널에 참여중인 사용자만 채널의 정보를 업데이트 할 수 있습니다.`,
          400,
        );
      }

      if (!this.isChannelOwner(channel, id)) {
        throw new ServiceError(
          `채널 소유자만 채널의 정보를 업데이트 할 수 있습니다.`,
          400,
        );
      }

      const result = await this.prismaService.channel.update({
        where: { id: channelId.value },
        data: {
          title,
          isPublic,
          password: password ? await this.mfaPasswordHash(password) : password,
          maximumMemberCount,
        },
      });

      return newServiceOkResponse(new ChannelDto(result));
    } catch (error) {
      if (error instanceof ServiceError) {
        this.logger.debug(
          `채널 업데이트과정에서 핸들링 되는 에러: ${error.message}`,
        );
        return { ok: false, error };
      }
      this.logger.debug(`채널 업데이트과정에서 언핸들 에러: ${error}`);
      return newServiceFailUnhandledResponse(400);
    }
  }

  // ChannelMember
  async joinChannel(
    id: UserId,
    channelId: ChannelId,
    inputPassword?: string | null,
  ): Promise<ServiceResponse<JoinedChannelInfoDto>> {
    try {
      await this.prismaService.$transaction(async (prisma) => {
        const channel = await this.prismaService.channel.findUnique({
          where: { id: channelId.value },
        });

        if (channel === null) {
          throw new ServiceError(
            `유효하지 않은 채널 Id: ${channelId.value}`,
            400,
          );
        }

        const channelMember = await prisma.channelMember.findUnique({
          where: {
            channelId_memberId: {
              channelId: channelId.value,
              memberId: id.value,
            },
          },
        });

        if (this.isUserInChannel(channelMember)) {
          return; // 이미 들어가 있으면 패스 => 데이터만 전달
        }

        if (channelMember?.memberType === ChannelMemberType.BANNED) {
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
          (!inputPassword ||
            !(await bcrypt.compare(inputPassword, channel.password)))
        ) {
          throw new ServiceError('올바른 비밀번호 입력이 필요합니다.', 400);
        }

        await prisma.channel.update({
          where: { id: channelId.value },
          data: {
            memberCount: {
              increment: 1,
            },
            members: {
              create: {
                memberId: id.value,
                memberType: ChannelMemberType.MEMBER,
              },
            },
          },
        });
      });

      const data = await this.getJoinedChannelInfo(id, channelId); // 참가한 채널의 정보 리턴
      this.logger.log(
        `joinChannel 성공: 유저 ${id.value}, 채널: ${channelId.value}`,
      );
      return newServiceOkResponse(data);
    } catch (error) {
      if (error instanceof ServiceError) {
        this.logger.debug(
          `채널 참여과정에서 핸들링 되는 에러: ${error.message}`,
        );
        return { ok: false, error };
      }
      if (IsForeignKeyConstraintFailError(error)) {
        return newServiceFailResponse('올바르지 않은 memberId입니다.', 400); // prisma.channel.update 시, 입력으로 들어온 id가 유효하지 않은 경우
      }
      if (isUniqueConstraintError(error)) {
        return newServiceFailResponse(createPrismaErrorMessage(error), 500); // 모종의 이유로(?) prisma.channel.update전 해당 채널멤버가 추가된다면, 발생할수도 있나 싶은 에러. 어쨋든 내부에러니 500
      }
      this.logger.debug(`채널 참여과정에서 핸들링 되지 않는 에러: ${error}`);
      return newServiceFailUnhandledResponse(500);
    }
  }

  async leaveChannel(
    id: UserId,
    channelId: ChannelId,
  ): Promise<ServiceResponse<LeavingChannelResponseDto>> {
    try {
      const result = await this.prismaService.$transaction(async (prisma) => {
        const channelMember = await prisma.channelMember.findUnique({
          where: {
            channelId_memberId: {
              channelId: channelId.value,
              memberId: id.value,
            },
          },
          select: {
            memberType: true,
            channel: {
              select: {
                ownerId: true,
              },
            },
            member: true,
          },
        });

        // 채널이나 멤버 아이디가 유효하지 않아도, 아래에서 걸림
        if (!this.isUserInChannel(channelMember)) {
          throw new ServiceError(
            '채널에 들어있지 않은 사용자는 방을 나갈 수 없습니다.',
            400,
          );
        }

        const willOwnerId =
          channelMember!.channel.ownerId === id.value ? null : undefined;

        // 채널 멤버카운트가 0이 되어도 삭제하지 않는것으로 결정
        const channel = await prisma.channel.update({
          where: {
            id: channelId.value,
          },
          data: {
            ownerId: willOwnerId,
            members: {
              delete: {
                channelId_memberId: {
                  channelId: channelId.value,
                  memberId: id.value,
                },
              },
            },
            memberCount: {
              decrement: 1,
            },
          },
        });

        return {
          channel: new ChannelDto(channel),
          member: new UserDto(channelMember!.member),
        };
      });
      this.logger.log(
        `leaveChannel 성공: 유저 ${id.value}, 채널: ${channelId.value}`,
      );
      return newServiceOkResponse(result);
    } catch (error) {
      if (error instanceof ServiceError) {
        return { ok: false, error };
      }
      if (
        IsRecordToUpdateNotFoundError(error) ||
        isRecordNotFoundError(error)
      ) {
        return newServiceFailResponse(createPrismaErrorMessage(error), 500); // prisma.channel.update 과정에서 병렬실행으로 인해 에러가 날 수도, 어쨋든 내부에러니 500
      }
      this.logger.error(error);
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
      const result = await this.prismaService.$transaction(async (prisma) => {
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
          await this.kickUser(channelId, targetId, prisma);
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
            prisma,
          );
        }
        return {
          triggerUser: triggerUser.member,
          targetUser: targetUser.member,
          channelId: prismaChannel.id,
          actionType,
        };
      });
      this.logger.log(
        `changeMemberStatus 성공: 유저 ${id.value}, 채널: ${channelId.value}, 타겟: ${targetId.value}, 액션: ${actionType}`,
      );
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
      this.logger.error(error);
      return newServiceFailUnhandledResponse(500);
    }
  }

  async sendMessage(
    userId: UserId,
    channelId: ChannelId,
    messageJson: string,
  ): Promise<ServiceResponse<MessageWithMemberDto>> {
    try {
      const result = await this.prismaService.$transaction(async (prisma) => {
        const channel = await prisma.channel.findUnique({
          where: { id: channelId.value },
        });
        // 1. 올바른 채널 ID
        if (channel === null) {
          throw new ServiceError('유효하지 않은 channelId', 400);
        }
        // 2. 방에 속한 유저만이 행동 할 수 있다.
        const channelMember = await prisma.channelMember.findUnique({
          where: {
            channelId_memberId: {
              channelId: channelId.value,
              memberId: userId.value,
            },
          },
          include: {
            member: true,
          },
        });

        if (!this.isUserInChannel(channelMember)) {
          throw new ServiceError(
            '채널에 속하지 않은 유저는 메시지를 보낼 수 없습니다.',
            400,
          );
        }
        if (new Date(channelMember!.mutedUntil) > new Date()) {
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
      const result = await this.prismaService.channel.findUniqueOrThrow({
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
      const result = await this.prismaService.channel.findUniqueOrThrow({
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
      const result = await this.prismaService.channelMember.findMany({
        where: {
          channelId: channelId.value,
          memberType: { not: ChannelMemberType.BANNED },
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
      const blockList = await this.dmService.getBlockUserList(userId.value);
      let result = await this.prismaService.channelMessage.findMany({
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
  //     const channelMember = await this.prismaService.channelMember.findUnique({
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
  //     const channel = await this.prismaService.channel.findUnique({
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

  async isParticipated(
    userId: UserId,
    channelId: ChannelId,
  ): Promise<ServiceResponse<boolean>> {
    try {
      const result = await this.prismaService.channelMember.findFirst({
        where: {
          channelId: channelId.value,
          memberId: userId.value,
          memberType: { not: ChannelMemberType.BANNED },
        },
      });
      if (result) return newServiceOkResponse(true);
      else return newServiceOkResponse(false);
    } catch (error) {
      return newServiceOkResponse(false);
    }
  }

  private async checkUserAlreadyInChannel(userId: string, channelId: string) {
    const result = await this.prismaService.channelMember.findFirst({
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
    const channelMember =
      await this.prismaService.channelMember.findUniqueOrThrow({
        where: {
          channelId_memberId: {
            channelId: channelId.value,
            memberId: userId.value,
          },
        },
      });
    const result = await this.prismaService.channel.findUniqueOrThrow({
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
    prisma?: TransactionPrismaType,
  ): Promise<ServiceResponse<ChannelMemberDetailDto>> {
    try {
      const user = await (
        prisma ?? this.prismaService
      ).channelMember.findUniqueOrThrow({
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

      await (prisma ?? this.prismaService).channel.update({
        where: {
          id: channelId.value,
        },
        data: {
          members: {
            delete: {
              channelId_memberId: {
                channelId: channelId.value,
                memberId: targetId.value,
              },
            },
          },
          memberCount: {
            decrement: 1,
          },
        },
      });

      return newServiceOkResponse(user);
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
    prisma?: TransactionPrismaType,
  ): Promise<ServiceResponse<ChannelMemberDetailDto>> {
    try {
      const result = await (prisma ?? this.prismaService).channelMember.update({
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
      if (memberType === ChannelMemberType.BANNED) {
        await (prisma ?? this.prismaService).channel.update({
          where: { id: channelId.value },
          data: {
            memberCount: {
              decrement: 1,
            },
          },
        });
      }
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
  private isUserInChannel(
    channelMember: { memberType: ChannelMemberType } | null,
  ) {
    return (
      channelMember !== null &&
      channelMember.memberType !== ChannelMemberType.BANNED
    );
  }
  private isChannelOwner(channel: { ownerId: string | null }, userId: UserId) {
    return channel.ownerId === userId.value;
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
