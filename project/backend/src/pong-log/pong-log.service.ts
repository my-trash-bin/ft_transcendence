import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PongGameHistory } from '@prisma/client';
import { PrismaService } from '../base/prisma.service';
import { GameHistoryId, UserId } from '../common/Id';
import {
  newServiceFailPrismaKnownResponse,
  newServiceFailUnhandledResponse,
  newServiceOkResponse,
  ServiceResponse,
} from '../common/ServiceResponse';
import {
  createPrismaErrorMessage,
  isRecordNotFoundError,
  IsRecordToUpdateNotFoundError,
  isUniqueConstraintError,
} from '../util/prismaError';
import { HistoryStaticDto } from './dto/history-static.dto';
import { PongLogDto } from './dto/pong-log.dto';
import { RankingRecordDto } from './dto/ranking-record.dto';

@Injectable()
export class PongLogService {
  private logger = new Logger('PongLogService');
  constructor(private readonly prisma: PrismaService) {}

  async findOneByUserId(
    id: UserId,
  ): Promise<HistoryStaticDto & { userLogs: PongLogDto[] }> {
    const userLogs = await this.prisma.pongGameHistory.findMany({
      where: {
        OR: [{ player1Id: id.value }, { player2Id: id.value }],
      },
      include: {
        player1: true,
        player2: true,
      },
    });
    const filtered = userLogs
      .filter(({ isPlayer1win }) => isPlayer1win !== null)
      .map(
        ({
          player1Id,
          player2Id,
          isPlayer1win,
          player1Score,
          player2Score,
          createdAt,
        }) => ({
          player1Id,
          player2Id,
          isPlayer1win,
          player1Score,
          player2Score,
          createdAt,
        }),
      );
    const cal = this.calculateStatistics(filtered, id);
    return {
      userLogs,
      ...cal,
    };
  }

  async findOne(id: GameHistoryId): Promise<ServiceResponse<PongGameHistory>> {
    try {
      const gameHistory = await this.prisma.pongGameHistory.findUniqueOrThrow({
        where: { id: id.value },
      });
      return newServiceOkResponse(gameHistory);
    } catch (error) {
      if (
        IsRecordToUpdateNotFoundError(error) ||
        isRecordNotFoundError(error)
      ) {
        return newServiceFailPrismaKnownResponse(error.code, 400);
      }
      if (isUniqueConstraintError(error)) {
        return newServiceFailPrismaKnownResponse(error.code, 400);
      }
      return newServiceFailUnhandledResponse(400);
    }
  }

  async create(player1Id: UserId, player2Id: UserId, createdAt?: Date) {
    try {
      const result = await this.prisma.pongGameHistory.create({
        data: {
          player1Id: player1Id.value,
          player2Id: player2Id.value,
          player1Score: 0,
          player2Score: 0,
          createdAt,
        },
      });

      return newServiceOkResponse(result);
    } catch (error) {
      if (
        IsRecordToUpdateNotFoundError(error) ||
        isRecordNotFoundError(error)
      ) {
        throw new BadRequestException(createPrismaErrorMessage(error));
      }
      return newServiceFailUnhandledResponse(400);
    }
  }

  async update(
    id: GameHistoryId,
    data: {
      player1Score?: number;
      player2Score?: number;
    },
  ) {
    try {
      const result = await this.prisma.pongGameHistory.update({
        where: {
          id: id.value,
        },
        data: {
          player1Score: data.player1Score,
          player2Score: data.player2Score,
        },
      });
      return newServiceOkResponse(result);
    } catch (error) {
      if (
        IsRecordToUpdateNotFoundError(error) ||
        isRecordNotFoundError(error)
      ) {
        throw new BadRequestException(createPrismaErrorMessage(error));
      }
      return newServiceFailUnhandledResponse(400);
    }
  }

  async gameFinish(
    id: GameHistoryId,
    data: {
      player1Score?: number;
      player2Score?: number;
      isPlayer1Win: boolean;
    },
  ) {
    try {
      const result = await this.prisma.pongGameHistory.update({
        where: {
          id: id.value,
        },
        data: {
          player1Score: data.player1Score,
          player2Score: data.player2Score,
          isPlayer1win: data.isPlayer1Win,
        },
      });
      return newServiceOkResponse(result);
    } catch (error) {
      if (
        IsRecordToUpdateNotFoundError(error) ||
        isRecordNotFoundError(error)
      ) {
        throw new BadRequestException(createPrismaErrorMessage(error));
      }
      return newServiceFailUnhandledResponse(400);
    }
  }

  async getRanking(): Promise<RankingRecordDto[]> {
    const gameHistories = await this.prisma.pongGameHistory.findMany();

    const playerStats = new Map<
      string,
      { wins: number; losses: number; winRate: number; totalGames: number }
    >();

    gameHistories.forEach((game) => {
      this.updateStats(playerStats, game.player1Id, game.isPlayer1win);
      this.updateStats(playerStats, game.player2Id, !game.isPlayer1win);
    });

    // 통계를 배열로 변환하고 랭킹 정렬
    const ranking = Array.from(playerStats.entries()).map(
      ([playerId, stats]) => ({
        playerId,
        ...stats,
        winRate:
          stats.totalGames === 0 ? 0 : (stats.wins / stats.totalGames) * 100,
      }),
    );

    ranking.sort((a, b) => b.winRate - a.winRate || b.wins - a.wins);

    return ranking;
  }

  private updateStats(
    statsMap: Map<string, any>,
    playerId: string,
    isWin: boolean,
  ): void {
    const stats = statsMap.get(playerId) || { wins: 0, losses: 0, games: 0 };
    stats.totalGames += 1;
    isWin ? (stats.wins += 1) : (stats.losses += 1);
    stats.winRate = statsMap.set(playerId, stats);
  }

  private calculateStatistics(
    userLogs: {
      player1Id: string;
      player2Id: string;
      player1Score: number;
      player2Score: number;
      isPlayer1win: boolean;
      createdAt: Date;
    }[],
    id: UserId,
  ): HistoryStaticDto {
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
