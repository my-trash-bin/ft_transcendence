import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../base/prisma.service';
import { GameHistoryId, UserId } from '../common/Id';
import {
  newServiceFailPrismaKnownResponse,
  newServiceFailUnhandledResponse,
  newServiceOkResponse,
  ServiceResponse,
} from '../common/ServiceResponse';
import { UserDto } from '../users/dto/user.dto';
import {
  createPrismaErrorMessage,
  isRecordNotFoundError,
  IsRecordToUpdateNotFoundError,
  isUniqueConstraintError,
} from '../util/prismaError';
import { HistoryStaticDto } from './dto/history-static.dto';
import { PongLogHistoryResponse } from './dto/pong-log-history-response.dto';
import { PongLogRankingRecordDto } from './dto/pong-log-ranking-record.dto';
import { PongLogStatDto } from './dto/pong-log-stat.dto';
import {
  PongGameHistoryWithPlayerType,
  PongLogDtoWithPlayerDto,
} from './dto/pong-log-with-player.dto';
import { PongLogDto } from './dto/pong-log.dto';

@Injectable()
export class PongLogService {
  private logger = new Logger('PongLogService');
  constructor(private readonly prisma: PrismaService) {}

  async getUserGameHistories(
    id: UserId,
  ): Promise<ServiceResponse<PongLogHistoryResponse>> {
    try {
      const gameHistories: PongGameHistoryWithPlayerType[] =
        await this.prisma.pongGameHistory.findMany({
          where: { OR: [{ player1Id: id.value }, { player2Id: id.value }] },
          include: {
            player1: true,
            player2: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
      const records = gameHistories.map(
        (el) => new PongLogDtoWithPlayerDto(el),
      );
      const stats = this.makeStats2(id, gameHistories);
      return newServiceOkResponse({ records, stats });
    } catch (error) {
      this.logger.debug(`히스토리 조회과정에서 에러 발생: ${error}`);
      return newServiceFailUnhandledResponse(400);
    }
  }

  async findOne(id: GameHistoryId): Promise<ServiceResponse<PongLogDto>> {
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

  async getRanking(): Promise<PongLogRankingRecordDto[]> {
    const users = await this.prisma.user.findMany({
      include: {
        pongGameHistory1: {
          select: {
            isPlayer1win: true,
          },
        },
        pongGameHistory2: {
          select: {
            isPlayer1win: true,
          },
        },
      },
    });

    const ranking = users.map((user) => ({
      user: new UserDto(user),
      ...this.makeStats(user.pongGameHistory1, user.pongGameHistory2),
      rank: 0,
    }));

    ranking.sort((a, b) => b.wins - a.wins || b.winRate - a.winRate);

    ranking.forEach((r, i) => (r.rank = i + 1));

    return ranking;
  }

  makeStats(
    pongGameHistory1: { isPlayer1win: boolean }[],
    pongGameHistory2: { isPlayer1win: boolean }[],
  ): PongLogStatDto {
    const stats = {
      wins: 0,
      losses: 0,
      totalGames: 0,
      winRate: 0,
    };
    pongGameHistory1.forEach((h) => {
      h.isPlayer1win ? (stats.wins += 1) : (stats.losses += 1);
    });
    pongGameHistory2.forEach((h) => {
      h.isPlayer1win ? (stats.losses += 1) : (stats.wins += 1);
    });
    stats.totalGames = stats.wins + stats.losses;
    stats.winRate = stats.totalGames
      ? (stats.wins / stats.totalGames) * 100
      : 0;
    return stats;
  }

  makeStats2(
    id: UserId,
    pongGameHistory: { player1Id: string; isPlayer1win: boolean }[],
  ): PongLogStatDto {
    const userId = id.value;
    const stats = {
      wins: 0,
      losses: 0,
      totalGames: 0,
      winRate: 0,
    };
    pongGameHistory.forEach((h) => {
      (h.player1Id === userId ? h.isPlayer1win : !h.isPlayer1win)
        ? (stats.wins += 1)
        : (stats.losses += 1);
    });
    stats.totalGames = stats.wins + stats.losses;
    stats.winRate = stats.totalGames
      ? (stats.wins / stats.totalGames) * 100
      : 0;
    return stats;
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
    id: UserId,
    userLogs: PongLogDto[],
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
