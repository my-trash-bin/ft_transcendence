import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { WsException } from '@nestjs/websockets';
import { JwtGuard } from '../auth/jwt.guard';
import { Phase, PhaseGuard } from '../auth/phase.guard';
import { idOf } from '../common/Id';
import { FindOneParam } from '../users/dto/user-request.dto';
import { PongLogHistoryResponse } from './dto/pong-log-history-response.dto';
import { PongLogRankingRecordDto } from './dto/pong-log-ranking-record.dto';
import { PongLogDto } from './dto/pong-log.dto';
import { PongLogService } from './pong-log.service';

@ApiTags('pong-log')
@Controller('/api/v1/pong-log')
export class PongLogController {
  constructor(private readonly pongLogService: PongLogService) {}

  @Get('rank')
  @ApiOperation({ summary: '랭킹 정보 반환' })
  @ApiOkResponse({
    description: '승률 상위 부터 제공',
    type: () => PongLogRankingRecordDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: '인증되지 않은 사용자' })
  @ApiForbiddenResponse({ description: '권한이 없는 사용자(by jwt.phase)' })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  async getRanking() {
    return await this.pongLogService.getRanking();
  }

  @Get(':id')
  @ApiOperation({ summary: '게임 1개의 로그 조회' })
  @ApiOkResponse({
    description: '유저 1개의 로그 반환',
    type: () => PongLogDto,
  })
  @ApiBadRequestResponse({ description: '올바르지 않은 id' })
  @ApiUnauthorizedResponse({ description: '인증되지 않은 사용자' })
  @ApiForbiddenResponse({ description: '권한이 없는 사용자(by jwt.phase)' })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  async findOne(@Param() param: FindOneParam) {
    const { id } = param;
    const result = await this.pongLogService.findOne(idOf(id));

    if (!result.ok) {
      throw new WsException(result.error!.message);
    }

    return result.data!;
  }

  // create : 컨트롤러 필요 X, 서비스에서 바로 호출

  @Get('users/:id')
  @ApiOperation({ summary: '유저 1명 기록 모두 조회' })
  @ApiOkResponse({
    description: '유저 1명의 로그 반환',
    type: () => PongLogHistoryResponse,
  })
  @ApiUnauthorizedResponse({ description: '인증되지 않은 사용자' })
  @ApiForbiddenResponse({ description: '권한이 없는 사용자(by jwt.phase)' })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  async getUserGameHistories(@Param() param: FindOneParam) {
    const { id } = param;
    return await this.pongLogService.getUserGameHistories(idOf(id));
  }
}
