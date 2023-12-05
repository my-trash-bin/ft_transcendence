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
import { NotificationService } from '../notification/notification.service';
import { AchievementWithReceived } from './dto/achievement-with-received.dto';
import { NotificationDto } from './dto/notification.dto';
import { UserAchievementDto } from './dto/user-achievement.dto';

@Injectable()
export class AchievementService {
  private logger = new Logger('AchievementService');
  constructor(
    private prisma: PrismaService,
    private notiService: NotificationService,
  ) {}

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
      this.logger.debug(result);
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

  async findByUser(userId: UserId): Promise<UserAchievementDto[]> {
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

  async grantAchievement(
    userId: UserId,
    achievementTitle: string,
  ): Promise<ServiceResponse<NotificationDto>> {
    // Transaction 시작
    try {
      const achievement = await this.prisma.$transaction(
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
          await prismaTransaction.userAchievement.create({
            data: {
              userId: userId.value,
              achievementId: achievement.id,
            },
          });

          return achievement;
        },
      );

      // Notification 생성
      return await this.notiService.create(
        userId,
        JSON.stringify({
          type: 'newAchievement',
          sourceId: achievement.id,
          sourceName: achievement.title,
        }),
      );
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
