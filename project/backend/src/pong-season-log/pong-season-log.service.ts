import { Injectable } from '@nestjs/common';
import { PrismaService } from '../base/prisma.service';
import { UserId } from '../common/Id';

export interface PongSeasonLog {
  season: number;
  userId: string;
  consecutiveWin: number;
  maxConsecutiveWin: number;
  maxConsecutiveLose: number;
  win: number;
  lose: number;
  total: number;
  winRate: number;
}

@Injectable()
export class PongSeasonLogService {
  constructor(private prisma: PrismaService) {}

  async findOne(userId: UserId): Promise<PongSeasonLog> {
    const DEFAULT_SEASON = 1;
    const prismaLog = await this.prisma.pongSeasonLog.findUnique({
      where: {
        userId_season: {
          userId: userId.value,
          season: DEFAULT_SEASON,
        },
      },
    });
    return (
      prismaLog ?? {
        season: DEFAULT_SEASON,
        userId: userId.value,
        consecutiveWin: 0,
        maxConsecutiveWin: 0,
        maxConsecutiveLose: 0,
        win: 0,
        lose: 0,
        total: 0,
        winRate: 0,
      }
    );
  }
}
