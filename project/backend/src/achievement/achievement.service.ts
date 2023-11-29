import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Achievement } from '@prisma/client';
import { PrismaService } from '../base/prisma.service';
import { UserId } from '../common/Id';
import { UserAchievementDto } from './dto/user-achievement.dto';

@Injectable()
export class AchievementService {
  constructor(private prisma: PrismaService) {}

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
  ): Promise<void> {
    // Transaction 시작
    await this.prisma.$transaction(async (prismaTransaction) => {
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
        throw new Error(`Achievement '${achievementTitle}' not found`);
      }

      if (
        achievement.achievedUsers.some(
          ({ userId: achievedUserId }) => achievedUserId === userId.value,
        )
      ) {
        throw new Error(`User already has achievement '${achievementTitle}'`);
      }

      // Achievement 부여
      await prismaTransaction.userAchievement.create({
        data: {
          userId: userId.value,
          achievementId: achievement.id,
        },
      });

      // Notification 생성
      await prismaTransaction.notification.create({
        data: {
          userId: userId.value,
          contentJson: JSON.stringify({
            message: `You have earned a new achievement: ${achievement.title}`,
          }),
        },
      });
    });
  }
}
