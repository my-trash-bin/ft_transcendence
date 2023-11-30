import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../base/prisma.service';
import { UserId } from '../common/Id';
import {
  newServiceFailPrismaKnownResponse,
  newServiceFailPrismaUnKnownResponse,
  newServiceFailResponse,
  newServiceOkResponse,
} from '../common/ServiceResponse';
import { userDtoSelect } from '../users/dto/user.dto';
import {
  createPrismaErrorMessage,
  isPrismaUnknownError,
  isRecordNotFoundError,
  IsRecordToUpdateNotFoundError,
} from '../util/prismaError';

@Injectable()
export class UserFollowService {
  constructor(private prismaService: PrismaService) {}

  async createOrUpdate(
    followerId: UserId,
    followeeId: UserId,
    isBlock: boolean,
  ) {
    try {
      const result = await this.prismaService.userFollow.upsert({
        where: {
          followerId_followeeId: {
            followerId: followerId.value,
            followeeId: followeeId.value,
          },
        },
        create: {
          followerId: followerId.value,
          followeeId: followeeId.value,
          isBlock,
        },
        update: {
          isBlock,
          followOrBlockedAt: new Date(),
        },
        select: {
          follower: true,
          followee: true,
          isBlock: true,
          followOrBlockedAt: true,
        },
      });
      return newServiceOkResponse(result);
    } catch (error) {
      if (
        IsRecordToUpdateNotFoundError(error) ||
        isRecordNotFoundError(error)
      ) {
        return newServiceFailPrismaKnownResponse(error.code, 400);
      }
      if (isPrismaUnknownError(error)) {
        newServiceFailPrismaUnKnownResponse(500);
      }
      return newServiceFailResponse('Unknown Error', 500);
    }
  }

  async findOne(followerId: UserId, followeeId: UserId) {
    return await this.prismaService.userFollow.findUnique({
      where: {
        followerId_followeeId: {
          followerId: followerId.value,
          followeeId: followeeId.value,
        },
      },
    });
  }

  async findByUsers(followerId: UserId, isBlock?: boolean) {
    return await this.prismaService.userFollow.findMany({
      where: {
        followerId: followerId.value,
        isBlock,
      },
      select: {
        isBlock: !isBlock, // isBlock이 undefined면 isBlock까지 필요
        followOrBlockedAt: true,
        followee: { select: userDtoSelect },
      },
    });
  }

  async getUsersBlockingMe(meId: UserId) {
    return await this.prismaService.userFollow.findMany({
      where: {
        followeeId: meId.value,
        isBlock: true,
      },
    });
  }

  async getUserRelationshipWithMe(followerId: UserId, meId: UserId) {
    return await this.prismaService.userFollow.findUnique({
      where: {
        followerId_followeeId: {
          followerId: followerId.value,
          followeeId: meId.value,
        },
      },
    });
  }

  async remove(followerId: UserId, followeeId: UserId, isBlock: boolean) {
    try {
      const userFollow = await this.prismaService.userFollow.delete({
        where: {
          followerId_followeeId: {
            followerId: followerId.value,
            followeeId: followeeId.value,
          },
          isBlock: true,
        },
      });
      return userFollow;
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
}
