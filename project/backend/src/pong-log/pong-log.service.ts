import { BadRequestException, Injectable } from '@nestjs/common';
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

@Injectable()
export class PongLogService {
  constructor(private prisma: PrismaService) {}

  async findOneByUserId(id: UserId) {
    const userLogs = await this.prisma.pongGameHistory.findMany({
      where: {
        OR: [{ player1Id: id.value }, { player2Id: id.value }],
      },
      include: {
        player1: true,
        player2: true,
      },
    });
    userLogs[0].player1;
    const filtered = userLogs
      .filter(({ isPlayer1win }) => isPlayer1win !== null)
      .map(({ player1Id, player2Id, isPlayer1win }) => ({
        player1Id,
        player2Id,
        isPlayer1win,
      }));
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
          updatedAt: new Date(),
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
          endAt: new Date(),
          updatedAt: new Date(),
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

  private calculateStatistics(
    userLogs: {
      player1Id: string;
      player2Id: string;
      isPlayer1win: boolean | null;
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
