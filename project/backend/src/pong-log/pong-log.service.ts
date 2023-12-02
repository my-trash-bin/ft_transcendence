import { Injectable } from '@nestjs/common';
import { PrismaService } from '../base/prisma.service';
import { UserId } from '../common/Id';

@Injectable()
export class PongLogService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: UserId) {
    const userLogs = await this.prisma.pongGameHistory.findMany({
      where: {
        OR: [{ player1Id: id.value }, { player2Id: id.value }],
      },
      include: {
        player1: true,
        player2: true,
      },
    });
    return {
      userLogs,
      ...this.calculateStatistics(userLogs, id),
    };
  }

  private calculateStatistics(
    userLogs: {
      id: string;
      player1Id: string;
      player2Id: string;
      player1Score: number;
      player2Score: number;
      isPlayer1win: boolean;
      createdAt: Date;
      endAt: Date;
      updatedAt: Date;
    }[],
    id: UserId,
  ) {
    const userId = id.value;

    let wins = 0;
    let losses = 0;
    let maxConsecutiveWins = 0;
    let maxConsecutiveLosses = 0;
    let currentConsecutiveWins = 0;
    let currentConsecutiveLosses = 0;
    let recentStreak = 0; // 최근 연승 또는 연패

    userLogs.forEach((log) => {
      const isPlayer1 = log.player1Id === userId;
      const isWin = isPlayer1 ? log.isPlayer1win : !log.isPlayer1win;

      if (isWin) {
        wins++;
        currentConsecutiveWins++;
        currentConsecutiveLosses = 0;
        maxConsecutiveWins = Math.max(
          maxConsecutiveWins,
          currentConsecutiveWins,
        );
      } else {
        losses++;
        currentConsecutiveLosses++;
        currentConsecutiveWins = 0;
        maxConsecutiveLosses = Math.max(
          maxConsecutiveLosses,
          currentConsecutiveLosses,
        );
      }

      recentStreak =
        currentConsecutiveWins > 0
          ? currentConsecutiveWins
          : -currentConsecutiveLosses;
    });

    const totalGames = wins + losses;
    const winRate = totalGames === 0 ? 0 : (wins / totalGames) * 100;

    return {
      wins,
      losses,
      totalGames,
      winRate,
      maxConsecutiveWins,
      recentStreak,
    };
  }
}
