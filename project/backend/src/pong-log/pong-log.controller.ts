import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt.guard';
import { Phase, PhaseGuard } from '../auth/phase.guard';
import { idOf } from '../common/Id';
import { FindOneParam } from '../users/dto/user-request.dto';
import { PongLogService } from './pong-log.service';

@ApiTags('pong-log')
@Controller('/api/v1/pong-log')
export class PongLogController {
  constructor(private readonly pongLogService: PongLogService) {}

  @Get(':id')
  @ApiOperation({ summary: '유저 1명의 로그 조회' })
  @ApiOkResponse({
    description: '유저 1명의 로그 반환',
    // type: () => PongSeasonLogDto,
  })
  @ApiBadRequestResponse({ description: '올바르지 않은 id' })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  async indOne(@Param() param: FindOneParam) {
    const { id } = param;
    const userLogs = await this.pongLogService.findOne(idOf(id));
    return userLogs;
  }
}
