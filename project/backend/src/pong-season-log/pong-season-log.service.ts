import { Injectable } from '@nestjs/common';
import { PrismaService } from '../base/prisma.service';
import { UserId } from '../common/Id';

@Injectable()
export class PongSeasonLogService {
  constructor(private prisma: PrismaService) {}

  async findOne(userId: UserId) {
    const DEFAULT_SEASON = 1;
    const prismaLog = await this.prisma.pongSeasonLog.findUnique({
      where: {
        userId_season: {
          userId: userId.value,
          season: DEFAULT_SEASON,
        },
      },
    });
    if (!prismaLog) {
      throw new Error('something');
    }
    return prismaLog;
  }
}
