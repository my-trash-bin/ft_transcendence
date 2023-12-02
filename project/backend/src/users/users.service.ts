import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChannelMemberType, Prisma } from '@prisma/client';
import { scrypt } from 'node:crypto';
import { PrismaService } from '../base/prisma.service';
import { UserId } from '../common/Id';
import {
  createPrismaErrorMessage,
  isPrismaUnknownError,
  isRecordNotFoundError,
  IsRecordToUpdateNotFoundError,
  isUniqueConstraintError,
} from '../util/prismaError';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RelationStatus } from './dto/user-profile.dto';
import { UserRelationshipDto } from './dto/user-relationship.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async me(id: UserId) {
    try {
      const followings = await this.prisma.userFollow.findMany({
        where: {
          followerId: id.value,
        },
      });
      const blockList = followings
        .filter(({ isBlock }) => isBlock)
        .map((el) => el.followeeId);
      const friends = followings
        .filter(({ isBlock }) => !isBlock)
        .map((el) => el.followeeId);
      const superMe = await this.prisma.user.findUniqueOrThrow({
        where: { id: id.value },
        select: {
          id: true,
          joinedAt: true,
          isLeaved: true,
          nickname: true,
          profileImageUrl: true,
          statusMessage: true,
          following: true,
          achievements: true,
          notifications: true,
          channels: {
            where: {
              NOT: { memberType: ChannelMemberType.BANNED },
            },
            include: {
              channel: {
                select: {
                  id: true,
                  title: true,
                  isPublic: true,
                  password: true,
                  createdAt: true,
                  lastActiveAt: true,
                  ownerId: true,
                  memberCount: true,
                  maximumMemberCount: true,
                  members: true,
                  messages: {
                    where: {
                      memberId: { notIn: blockList },
                    },
                  },
                },
              },
            },
          },
          dmChannel1: {
            where: {
              AND: [
                {
                  member1Id: {
                    notIn: blockList,
                  },
                  member2Id: {
                    notIn: blockList,
                  },
                },
              ],
            },
            include: {
              DMMessage: true,
            },
          },
          dmChannel2: {
            where: {
              AND: [
                {
                  member1Id: {
                    notIn: blockList,
                  },
                  member2Id: {
                    notIn: blockList,
                  },
                },
              ],
            },
            include: {
              DMMessage: true,
            },
          },
        },
      });
      return superMe;
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
      throw error;
    }
  }

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    try {
      const prismaUser = await this.prisma.user.create({
        data: {
          nickname: createUserDto.nickname,
          profileImageUrl: createUserDto.profileImageUrl,
        },
      });
      return prismaUser;
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictException(createPrismaErrorMessage(error));
      }
      if (IsRecordToUpdateNotFoundError(error)) {
        throw new BadRequestException(createPrismaErrorMessage(error));
      }
      if (isPrismaUnknownError(error)) {
        throw new InternalServerErrorException(createPrismaErrorMessage(error));
      }
      throw error;
    }
  }

  async findAll(): Promise<UserDto[]> {
    const prismaUsers = await this.prisma.user.findMany({
      where: {
        isLeaved: false,
      },
    });
    return prismaUsers.map((prismaUser) => new UserDto(prismaUser));
  }

  async findOne(targetId: UserId) {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id: targetId.value },
    });
    return prismaUser === null ? null : new UserDto(prismaUser);
  }

  async findOneByNickname(nickname: string) {
    const prismaUser = await this.prisma.user.findUnique({
      where: { nickname },
    });
    return prismaUser === null ? null : new UserDto(prismaUser);
  }

  async searchByBickname(
    id: UserId,
    nickname: string,
  ): Promise<UserRelationshipDto[]> {
    console.log('searchByBickname', nickname);
    const where: Prisma.UserWhereInput | undefined = !nickname
      ? undefined
      : {
          nickname: {
            contains: nickname,
          },
        };

    const prismaUsers = await this.prisma.user.findMany({
      where,
      include: {
        followedBy: {
          where: {
            followerId: id.value,
          },
        },
      },
    });

    return prismaUsers.map(
      (prismaUser) =>
        new UserRelationshipDto(
          prismaUser,
          prismaUser.id === id.value
            ? RelationStatus.Me
            : this.getRelation(
                prismaUser.followedBy.length === 0
                  ? undefined
                  : prismaUser.followedBy[0].isBlock,
              ),
        ),
    );
  }

  async update(id: UserId, updateUserDto: UpdateUserDto) {
    try {
      const prismaUser = await this.prisma.user.update({
        where: { id: id.value },
        data: {
          nickname: updateUserDto.nickname,
          profileImageUrl: updateUserDto.profileImageUrl,
          statusMessage: updateUserDto.statusMessage,
        },
      });
      return new UserDto(prismaUser);
    } catch (error) {
      if (
        IsRecordToUpdateNotFoundError(error) ||
        isRecordNotFoundError(error)
      ) {
        throw new BadRequestException(createPrismaErrorMessage(error));
      }
      if (isUniqueConstraintError(error)) {
        throw new ConflictException(createPrismaErrorMessage(error));
      }
      throw error;
    }
  }

  async setTwoFactorPassword(id: UserId, password: string) {
    const mfaPasswordHash = await this.mfaPasswordHash(password);
    try {
      await this.prisma.user.update({
        where: { id: id.value },
        data: { mfaPasswordHash },
      });
    } catch (error) {
      if (
        IsRecordToUpdateNotFoundError(error) ||
        isRecordNotFoundError(error)
      ) {
        throw new BadRequestException(createPrismaErrorMessage(error));
      }
      throw error;
    }
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }

  getRelation = (isBlock?: boolean): RelationStatus =>
    isBlock === undefined
      ? RelationStatus.None
      : isBlock
      ? RelationStatus.Block
      : RelationStatus.Friend;

  async isUniqueNickname(nickname: string) {
    const prismaUser = await this.prisma.user.findUnique({
      where: {
        nickname,
      },
    });
    return prismaUser === null;
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
