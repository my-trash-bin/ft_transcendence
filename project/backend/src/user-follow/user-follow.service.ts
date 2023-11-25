import { Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../base/prisma.service';
import { UserId } from '../common/Id';
import {
  newServiceFailPrismaKnownResponse,
  newServiceFailPrismaUnKnownResponse,
  newServiceOkResponse,
} from '../common/ServiceResponse';
import { userSelect } from '../users/dto/user.dto';

@Injectable()
export class UserFollowService {
  constructor(private prismaService: PrismaService) {}

  async createOrUpdate(
    followerId: UserId,
    followeeId: UserId,
    isBlock: boolean,
  ) {
    try {
      const result = await this.prismaService.$transaction(async (prisma) => {
        return await this.prismaService.userFollow.upsert({
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
      });
      return newServiceOkResponse(result);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        return newServiceFailPrismaKnownResponse(error.code, 400);
      }
      return newServiceFailPrismaUnKnownResponse(500);
    }
  }

  findAll() {
    return `This action returns all userFollow`;
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
        followee: { select: userSelect },
      },
    });
  }

  async remove(
    followerId: UserId,
    followeeId: UserId,
    isBlock: boolean,
  ): Promise<void> {
    const record = await this.prismaService.userFollow.findUnique({
      where: {
        followerId_followeeId: {
          followerId: followerId.value,
          followeeId: followeeId.value,
        },
      },
    });
    if (record && record.isBlock === isBlock) {
      await this.prismaService.userFollow.delete({
        where: {
          followerId_followeeId: {
            followerId: followerId.value,
            followeeId: followeeId.value,
          },
        },
      });
    }
  }
}
