import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Achievement } from '@prisma/client';
import { PrismaService } from '../base/prisma.service';
import { UserId } from '../common/Id';
import { ServiceError } from '../common/ServiceError';
import {
  newServiceFailResponse,
  newServiceFailUnhandledResponse,
  newServiceOkResponse,
  ServiceResponse,
} from '../common/ServiceResponse';
import { AchievementWithReceived } from './dto/achievement-with-received.dto';
import { UserAchievementWithAchievementDto } from './dto/user-achievement-with-achievement.dto';

@Injectable()
export class AchievementService {
  private logger = new Logger('AchievementService');
  private monitorEvents: Record<string, Record<number, string>> = {
    newUser: {
      1: '손님',
    },
    newFriend: {
      1: '인싸1',
      5: '인싸2',
      10: '인싸3',
    },
    newChannel: {
      1: '리더',
    },
    endGame: {
      1: '게임러버1',
      5: '게임러버2',
      10: '게임러버3',
    },
    winGame: {
      1: '게임왕',
    },
  };
  constructor(private prisma: PrismaService) {}

  async findAllWithReceived(
    userId: UserId,
  ): Promise<ServiceResponse<AchievementWithReceived[]>> {
    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        const achievements = await prisma.achievement.findMany({
          include: {
            achievedUsers: {
              where: {
                userId: userId.value,
              },
            },
          },
        });
        return achievements.map((achieve) => ({
          id: achieve.id,
          title: achieve.title,
          imageUrl: achieve.imageUrl,
          description: achieve.description,
          isMine: achieve.achievedUsers.length !== 0,
        }));
      });
      // this.logger.debug(result);
      return newServiceOkResponse(result);
    } catch (error) {
      return newServiceFailUnhandledResponse(400);
    }
  }

  async findAll(): Promise<Achievement[]> {
    try {
      return await this.prisma.achievement.findMany();
    } catch (error) {
      throw new InternalServerErrorException('데이터베이스 오류 발생');
    }
  }

  async findByUser(
    userId: UserId,
  ): Promise<UserAchievementWithAchievementDto[]> {
    try {
      return await this.prisma.userAchievement.findMany({
        where: {
          userId: userId.value,
        },
        include: {
          achievement: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('데이터베이스 오류 발생');
    }
  }

  async checkGrantAchievement(
    eventDatas: { userId: UserId; eventType: string; eventValue: number }[],
  ): Promise<UserAchievementWithAchievementDto[]> {
    const promises = eventDatas.reduce(
      (prev, cur) =>
        cur.eventType in this.monitorEvents &&
        cur.eventValue in this.monitorEvents[cur.eventType]
          ? [
              ...prev,
              this.grantAchievement(
                cur.userId,
                this.monitorEvents[cur.eventType][cur.eventValue],
              ),
            ]
          : [...prev],
      [] as Promise<ServiceResponse<UserAchievementWithAchievementDto>>[],
    );
    const r = await Promise.all(promises);
    return r.filter((result) => result.ok).map((result) => result.data!);
  }

  async grantAchievement(
    userId: UserId,
    achievementTitle: string,
  ): Promise<ServiceResponse<UserAchievementWithAchievementDto>> {
    // Transaction 시작
    try {
      const userAchievement = await this.prisma.$transaction(
        async (prismaTransaction) => {
          // Achievement 조회
          const achievement = await prismaTransaction.achievement.findFirst({
            where: { title: achievementTitle },
            include: {
              achievedUsers: {
                where: {
                  userId: userId.value,
                },
              },
            },
          });

          if (!achievement) {
            throw new ServiceError(
              `Achievement '${achievementTitle}' not found`,
              400,
            );
          }

          if (achievement.achievedUsers.length !== 0) {
            throw new ServiceError(
              `User already has achievement '${achievementTitle}'`,
              400,
            );
          }

          // Achievement 부여
          return await prismaTransaction.userAchievement.create({
            data: {
              userId: userId.value,
              achievementId: achievement.id,
            },
            include: {
              achievement: true,
            },
          });
        },
      );
      // noti 삭제
      return newServiceOkResponse(userAchievement);
    } catch (error) {
      if (error instanceof ServiceError) {
        this.logger.debug(
          `업적 부여 실패(${error.statusCode}): ${error.message}`,
        );
        return newServiceFailResponse(
          `업적 부여 실패: ${error.message}`,
          error.statusCode,
        );
      }
      return newServiceFailUnhandledResponse(500);
    }
  }
}
