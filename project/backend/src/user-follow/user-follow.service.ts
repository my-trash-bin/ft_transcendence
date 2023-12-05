import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AchievementService } from '../achievement/achievement.service';
import { PrismaService } from '../base/prisma.service';
import { UserId } from '../common/Id';
import {
  newServiceFailPrismaKnownResponse,
  newServiceFailPrismaUnKnownResponse,
  newServiceFailResponse,
  newServiceOkResponse,
  ServiceResponse,
} from '../common/ServiceResponse';
import { UserDto, userDtoSelect } from '../users/dto/user.dto';
import {
  createPrismaErrorMessage,
  isPrismaUnknownError,
  isRecordNotFoundError,
  IsRecordToUpdateNotFoundError,
} from '../util/prismaError';

@Injectable()
export class UserFollowService {
  constructor(
    private prismaService: PrismaService,
    private achievementService: AchievementService,
  ) {}

  async createOrUpdate(
    followerId: UserId,
    followeeId: UserId,
    isBlock: boolean,
  ): Promise<
    ServiceResponse<{
      isBlock: boolean;
      followOrBlockedAt: Date;
      follower: UserDto;
      followee: UserDto;
    }>
  > {
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
      const count = await this.prismaService.userFollow.count({
        where: {
          followerId: followerId.value,
          isBlock: false,
        },
      });
      if (isBlock) {
        await this.achievementService.checkGrantAchievement(followeeId, [
          {
            eventType: 'newFriend',
            eventValue: count,
          },
        ]);
      }
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
      await this.prismaService.userFollow.delete({
        where: {
          followerId_followeeId: {
            followerId: followerId.value,
            followeeId: followeeId.value,
          },
          isBlock,
        },
      });
    } catch (error) {
      if (
        IsRecordToUpdateNotFoundError(error) ||
        isRecordNotFoundError(error)
      ) {
        // 궁극적으로 해당 레코드가 존재하지 않으면 되기에, 성공 처리
        return;
      }
      if (isPrismaUnknownError(error)) {
        throw new InternalServerErrorException(createPrismaErrorMessage(error));
      }
      throw error;
    }
  }
}
